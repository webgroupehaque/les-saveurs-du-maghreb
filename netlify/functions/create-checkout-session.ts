import Stripe from 'stripe';
import { Handler } from '@netlify/functions';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

const SUPABASE_URL = process.env.SUPABASE_URL!;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY!;

const DELIVERY_FEE = 2.50;

type Choice = { id: string; name: string; price?: number };
type DbMenuItem = {
  item_id: string;
  base_price: number;
  options: { isComposed?: boolean; availableChoices?: Choice[] } | null;
};

// Récupère le menu de référence (source de vérité = base, jamais le prix envoyé par le client)
async function fetchMenuItems(restaurantId: string): Promise<DbMenuItem[]> {
  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/menu_items?restaurant_id=eq.${restaurantId}&is_available=eq.true&select=item_id,base_price,options`,
      { headers: { apikey: SUPABASE_SERVICE_KEY, Authorization: `Bearer ${SUPABASE_SERVICE_KEY}` } },
    );
    if (!res.ok) return [];
    return await res.json();
  } catch {
    return [];
  }
}

// Retrouve l'item de base d'un article du panier.
// Pour un plat composé, l'id panier vaut `${item_id}-${choixTriés}` (cf. App.tsx addToCart).
function resolveBaseItem(cartItemId: string, menu: DbMenuItem[]): DbMenuItem | null {
  const direct = menu.find((m) => m.item_id === cartItemId);
  if (direct) return direct;
  const prefixed = menu
    .filter((m) => cartItemId.startsWith(`${m.item_id}-`))
    .sort((a, b) => b.item_id.length - a.item_id.length);
  return prefixed[0] ?? null;
}

// Recalcule le prix unitaire côté serveur, à l'identique du frontend (MenuSection.handleAddComposedItem) :
// - base_price > 0  → prix fixe (plats simples, glaces/sorbets)
// - base_price == 0 → somme des prix des choix sélectionnés
// Retourne null si l'article ou un choix est inconnu (→ commande rejetée).
function serverUnitPrice(
  cartItem: { id: string; options?: { selectedChoices?: Choice[] } },
  menu: DbMenuItem[],
): number | null {
  const base = resolveBaseItem(cartItem.id, menu);
  if (!base) return null;
  const basePrice = Number(base.base_price);
  if (basePrice > 0) return basePrice;

  const choices = cartItem.options?.selectedChoices;
  if (!choices || choices.length === 0) return null;
  const available = base.options?.availableChoices ?? [];
  let sum = 0;
  for (const ch of choices) {
    const def = available.find((c) => c.id === ch.id);
    if (!def) return null;
    sum += Number(def.price || 0);
  }
  return sum;
}

async function validatePromoCode(
  code: string,
  restaurantId: string,
  subtotalEuros: number,
): Promise<{ valid: true; discountCents: number; codeNormalized: string } | { valid: false; error: string }> {
  try {
    const url = `${SUPABASE_URL}/rest/v1/promo_codes?code=ilike.${encodeURIComponent(code)}&is_active=eq.true&select=*`;
    const res = await fetch(url, {
      headers: { apikey: SUPABASE_SERVICE_KEY, Authorization: `Bearer ${SUPABASE_SERVICE_KEY}` },
    });
    if (!res.ok) return { valid: false, error: 'Erreur validation code promo' };
    const list = await res.json();
    if (!Array.isArray(list) || list.length === 0) return { valid: false, error: 'Code promo invalide' };
    const promo = list[0];
    const now = new Date();
    if (promo.restaurant_id && promo.restaurant_id !== restaurantId) return { valid: false, error: 'Code non valide pour ce restaurant' };
    if (promo.valid_from && new Date(promo.valid_from) > now) return { valid: false, error: 'Code pas encore valide' };
    if (promo.valid_until && new Date(promo.valid_until) < now) return { valid: false, error: 'Code expiré' };
    if (promo.max_uses != null && promo.used_count >= promo.max_uses) return { valid: false, error: 'Code épuisé' };
    if (promo.min_order_cents > 0 && Math.round(subtotalEuros * 100) < promo.min_order_cents) {
      return { valid: false, error: `Minimum ${(promo.min_order_cents / 100).toFixed(2)}€ requis` };
    }
    let discountCents = promo.discount_type === 'percentage'
      ? Math.round(subtotalEuros * 100 * (Number(promo.discount_value) / 100))
      : Math.round(Number(promo.discount_value) * 100);
    discountCents = Math.min(discountCents, Math.round(subtotalEuros * 100));
    return { valid: true, discountCents, codeNormalized: promo.code };
  } catch {
    return { valid: false, error: 'Erreur serveur' };
  }
}

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') return { statusCode: 405, body: 'Method Not Allowed' };

  try {
    const { cartItems, deliveryInfo, restaurantId, promoCode } = JSON.parse(event.body || '{}');
    const resolvedRestaurantId = restaurantId || 'saveurs-maghreb';

    if (!Array.isArray(cartItems) || cartItems.length === 0) {
      return { statusCode: 400, body: JSON.stringify({ error: 'Panier vide' }) };
    }

    // Source de vérité des prix : la base. Si elle est joignable et non vide, on valide
    // strictement ; en cas de panne Supabase on retombe sur le prix client pour ne pas
    // bloquer le service (le fetch est côté serveur, le client ne peut pas le forcer à échouer).
    const menu = await fetchMenuItems(resolvedRestaurantId);
    const useServerPricing = menu.length > 0;

    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [];
    let serverSubtotal = 0;

    for (const item of cartItems) {
      let unitPrice: number;
      if (useServerPricing) {
        const computed = serverUnitPrice(item, menu);
        if (computed == null) {
          return { statusCode: 400, body: JSON.stringify({ error: `Produit invalide: ${item.name || item.id}` }) };
        }
        unitPrice = computed;
      } else {
        unitPrice = Number(item.price) || 0;
      }

      const quantity = Math.max(1, Math.floor(Number(item.quantity) || 1));
      serverSubtotal += unitPrice * quantity;

      lineItems.push({
        price_data: {
          currency: 'eur',
          product_data: {
            name: item.name,
            description: item.options?.selectedChoices
              ? item.options.selectedChoices.map((c: Choice) => c.name).join(', ')
              : undefined,
            metadata: {
              itemId: item.id,
              category: item.category || '',
              choices: item.options?.selectedChoices ? JSON.stringify(item.options.selectedChoices) : '',
            },
          },
          unit_amount: Math.round(unitPrice * 100),
        },
        quantity,
      });
    }

    const serverDeliveryFee = deliveryInfo.orderType === 'delivery' ? DELIVERY_FEE : 0;
    if (serverDeliveryFee > 0) {
      lineItems.push({
        price_data: { currency: 'eur', product_data: { name: 'Frais de livraison' }, unit_amount: Math.round(serverDeliveryFee * 100) },
        quantity: 1,
      });
    }

    const serverTotal = serverSubtotal + serverDeliveryFee;

    let validatedPromoCode: string | null = null;
    let discountCents = 0;
    if (promoCode && typeof promoCode === 'string' && promoCode.trim()) {
      const result = await validatePromoCode(promoCode.trim(), resolvedRestaurantId, serverSubtotal);
      if (!result.valid) return { statusCode: 400, body: JSON.stringify({ error: result.error }) };
      validatedPromoCode = result.codeNormalized;
      discountCents = result.discountCents;
    }

    const truncatedInstructions = deliveryInfo.instructions ? deliveryInfo.instructions.substring(0, 200) : '';

    const sessionConfig: Stripe.Checkout.SessionCreateParams = {
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${event.headers.origin || 'https://saveurs-maghreb.netlify.app'}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${event.headers.origin || 'https://saveurs-maghreb.netlify.app'}/?canceled=true`,
      customer_email: deliveryInfo.email,
      metadata: {
        restaurantId: resolvedRestaurantId,
        customerName: deliveryInfo.name.substring(0, 100),
        customerPhone: deliveryInfo.phone.substring(0, 50),
        customerEmail: deliveryInfo.email.substring(0, 100),
        deliveryAddress: (deliveryInfo.address || '').substring(0, 200),
        deliveryCity: (deliveryInfo.city || '').substring(0, 50),
        deliveryZipCode: (deliveryInfo.zipCode || '').substring(0, 10),
        orderType: deliveryInfo.orderType,
        instructions: truncatedInstructions,
        itemsCount: cartItems.length.toString(),
        subtotal: serverSubtotal.toFixed(2),
        deliveryFee: serverDeliveryFee.toFixed(2),
        totalAmount: serverTotal.toFixed(2),
        promoCode: validatedPromoCode ?? '',
      },
    };

    if (discountCents > 0) {
      const coupon = await stripe.coupons.create({
        amount_off: discountCents, currency: 'eur', duration: 'once', name: `Code ${validatedPromoCode}`,
      });
      sessionConfig.discounts = [{ coupon: coupon.id }];
    }

    const session = await stripe.checkout.sessions.create(sessionConfig);
    return { statusCode: 200, body: JSON.stringify({ url: session.url }) };
  } catch (error: any) {
    console.error('Stripe error:', error);
    return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
  }
};

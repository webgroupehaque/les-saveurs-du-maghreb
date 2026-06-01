import Stripe from 'stripe';
import { Handler } from '@netlify/functions';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

const SUPABASE_URL = process.env.SUPABASE_URL!;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY!;

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
    const { cartItems, deliveryInfo, subtotal, deliveryFee, total, restaurantId, promoCode } = JSON.parse(event.body || '{}');

    const lineItems: any[] = cartItems.map((item: any) => ({
      price_data: {
        currency: 'eur',
        product_data: {
          name: item.name,
          description: item.options?.selectedChoices ? item.options.selectedChoices.map((c: any) => c.name).join(', ') : undefined,
          metadata: {
            itemId: item.id,
            category: item.category || '',
            choices: item.options?.selectedChoices ? JSON.stringify(item.options.selectedChoices) : ''
          }
        },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.quantity,
    }));

    if (deliveryFee > 0) {
      lineItems.push({
        price_data: { currency: 'eur', product_data: { name: 'Frais de livraison' }, unit_amount: Math.round(deliveryFee * 100) },
        quantity: 1,
      });
    }

    let validatedPromoCode: string | null = null;
    let discountCents = 0;
    if (promoCode && typeof promoCode === 'string' && promoCode.trim()) {
      const result = await validatePromoCode(promoCode.trim(), restaurantId || 'saveurs-maghreb', Number(subtotal));
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
        restaurantId: restaurantId || 'saveurs-maghreb',
        customerName: deliveryInfo.name.substring(0, 100),
        customerPhone: deliveryInfo.phone.substring(0, 50),
        customerEmail: deliveryInfo.email.substring(0, 100),
        deliveryAddress: (deliveryInfo.address || '').substring(0, 200),
        deliveryCity: (deliveryInfo.city || '').substring(0, 50),
        deliveryZipCode: (deliveryInfo.zipCode || '').substring(0, 10),
        orderType: deliveryInfo.orderType,
        instructions: truncatedInstructions,
        itemsCount: cartItems.length.toString(),
        subtotal: subtotal.toFixed(2),
        deliveryFee: deliveryFee.toFixed(2),
        totalAmount: total.toFixed(2),
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

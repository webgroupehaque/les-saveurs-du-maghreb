import Stripe from 'stripe';
import { Handler } from '@netlify/functions';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { cartItems, deliveryInfo, subtotal, deliveryFee, total, restaurantId } = JSON.parse(event.body || '{}');

    // Créer les line items pour Stripe avec metadata pour récupération complète
    const lineItems = cartItems.map((item: any) => ({
      price_data: {
        currency: 'eur',
        product_data: {
          name: item.name,
          description: item.options?.selectedChoices 
            ? item.options.selectedChoices.map((c: any) => c.name).join(', ')
            : undefined,
          metadata: {
            itemId: item.id,
            category: item.category || '',
            choices: item.options?.selectedChoices 
              ? JSON.stringify(item.options.selectedChoices)
              : ''
          }
        },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.quantity,
    }));

    // Ajouter les frais de livraison si nécessaire
    if (deliveryFee > 0) {
      lineItems.push({
        price_data: {
          currency: 'eur',
          product_data: {
            name: 'Frais de livraison',
          },
          unit_amount: Math.round(deliveryFee * 100),
        },
        quantity: 1,
      });
    }

    // Simplifier les items pour respecter la limite Stripe de 500 caractères par metadata
    const simplifiedItems = cartItems.map((item: any) => ({
      id: item.id,
      name: item.name.substring(0, 100), // Limiter la longueur du nom
      quantity: item.quantity,
      price: item.price,
      choices: item.options?.selectedChoices 
        ? item.options.selectedChoices.map((c: any) => c.name).join(', ').substring(0, 100)
        : ''
    }));
    
    // Tronquer les instructions si trop longues
    const maxInstructionsLength = 200;
    const truncatedInstructions = deliveryInfo.instructions 
      ? deliveryInfo.instructions.substring(0, maxInstructionsLength)
      : '';
    
    // Créer la session Stripe
    const session = await stripe.checkout.sessions.create({
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
      },
    });
    
    // Stocker les données complètes dans la session (accessible via l'API Stripe)
    // On utilisera la session.line_items dans le webhook pour récupérer les détails complets

    return {
      statusCode: 200,
      body: JSON.stringify({ url: session.url }),
    };
  } catch (error: any) {
    console.error('Stripe error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};

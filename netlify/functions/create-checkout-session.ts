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

    // Créer les line items pour Stripe
    const lineItems = cartItems.map((item: any) => ({
      price_data: {
        currency: 'eur',
        product_data: {
          name: item.name,
          description: item.options?.selectedChoices 
            ? item.options.selectedChoices.map((c: any) => c.name).join(', ')
            : undefined,
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
        customerName: deliveryInfo.name,
        customerPhone: deliveryInfo.phone,
        customerEmail: deliveryInfo.email,
        deliveryAddress: deliveryInfo.address || '',
        deliveryCity: deliveryInfo.city || '',
        deliveryZipCode: deliveryInfo.zipCode || '',
        orderType: deliveryInfo.orderType,
        instructions: deliveryInfo.instructions || '',
        orderData: JSON.stringify(cartItems),
        subtotal: subtotal.toString(),
        deliveryFee: deliveryFee.toString(),
        totalAmount: total.toString(),
      },
    });

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

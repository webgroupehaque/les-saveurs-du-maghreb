import Stripe from 'stripe';
import { Handler } from '@netlify/functions';
import { createClient } from '@supabase/supabase-js';
import nodemailer from 'nodemailer';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

export const handler: Handler = async (event) => {
  const sig = event.headers['stripe-signature']!;

  try {
    const stripeEvent = stripe.webhooks.constructEvent(
      event.body!,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );

    if (stripeEvent.type === 'checkout.session.completed') {
      const session = stripeEvent.data.object as Stripe.Checkout.Session;
      const metadata = session.metadata!;

      // ✅ FILTRE : Ignore les commandes qui ne sont pas pour ce restaurant
      if (metadata.restaurantId !== 'saveurs-maghreb') {
        console.log(`⚠️ Webhook ignoré : commande pour ${metadata.restaurantId}, pas pour saveurs-maghreb`);
        return {
          statusCode: 200,
          body: JSON.stringify({ 
            received: true, 
            ignored: true,
            reason: 'Not for this restaurant'
          })
        };
      }

      const orderData = JSON.parse(metadata.orderData);

      // Générer un code de commande unique
      const orderCode = String(Math.floor(1000 + Math.random() * 9000));

      // Sauvegarder dans Supabase
      const { error: dbError } = await supabase.from('orders').insert({
        restaurant_id: 'saveurs-maghreb',
        order_code: orderCode,
        customer_name: metadata.customerName,
        customer_email: metadata.customerEmail,
        customer_phone: metadata.customerPhone,
        delivery_address: metadata.deliveryAddress,
        delivery_city: metadata.deliveryCity,
        delivery_zip_code: metadata.deliveryZipCode,
        order_type: metadata.orderType,
        instructions: metadata.instructions,
        items: orderData,
        subtotal: parseFloat(metadata.subtotal),
        delivery_fee: parseFloat(metadata.deliveryFee),
        total_amount: parseFloat(metadata.totalAmount),
        payment_status: 'paid',
        stripe_session_id: session.id,
      });

      if (dbError) {
        console.error('Supabase error:', dbError);
      }

      // Envoyer les emails
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.GMAIL_USER,
          pass: process.env.GMAIL_PASSWORD,
        },
      });

      // Email au restaurateur
      const restaurantEmail = {
        from: `"Les Saveurs du Maghreb" <${process.env.GMAIL_USER}>`,
        to: process.env.RESTAURANT_EMAIL || 'lessaveursdumaghreb16@gmail.com',
        subject: `🔔 Nouvelle commande #${orderCode} - ${metadata.customerName}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #2d6a4f 0%, #1b4332 100%); padding: 30px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 28px;">🍽️ Les Saveurs du Maghreb</h1>
              <p style="color: #d8f3dc; margin: 10px 0 0 0; font-size: 14px;">Restaurant Maghrébin - Nancy</p>
            </div>
            
            <div style="padding: 30px; background-color: #f8f9fa;">
              <h2 style="color: #2d6a4f; margin-top: 0;">Nouvelle Commande #${orderCode}</h2>
              
              <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                <h3 style="margin: 0 0 15px 0; color: #1f2937;">👤 Client</h3>
                <p style="margin: 5px 0; color: #4b5563;"><strong>Nom :</strong> ${metadata.customerName}</p>
                <p style="margin: 5px 0; color: #4b5563;"><strong>Téléphone :</strong> ${metadata.customerPhone}</p>
                <p style="margin: 5px 0; color: #4b5563;"><strong>Email :</strong> ${metadata.customerEmail}</p>
              </div>
              
              <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                <h3 style="margin: 0 0 15px 0; color: #1f2937;">📦 Type de commande</h3>
                <p style="margin: 5px 0; color: #4b5563; font-weight: bold;">
                  ${metadata.orderType === 'delivery' ? '🚗 LIVRAISON' : '📦 À EMPORTER'}
                </p>
                ${metadata.orderType === 'delivery' ? `
                  <p style="margin: 5px 0; color: #4b5563;">${metadata.deliveryAddress}</p>
                  <p style="margin: 5px 0; color: #4b5563;">${metadata.deliveryZipCode} ${metadata.deliveryCity}</p>
                ` : ''}
                ${metadata.instructions ? `<p style="margin: 10px 0 0 0; color: #4b5563; font-style: italic;"><strong>Instructions :</strong> ${metadata.instructions}</p>` : ''}
              </div>
              
              <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                <h3 style="margin: 0 0 15px 0; color: #1f2937;">🛒 Articles</h3>
                ${orderData.map((item: any) => `
                  <div style="padding: 10px 0; border-bottom: 1px solid #e5e7eb;">
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                      <div>
                        <strong style="color: #1f2937;">${item.quantity}x ${item.name}</strong>
                        ${item.options?.selectedChoices ? `<div style="color: #6b7280; font-size: 13px; margin-top: 4px;">${item.options.selectedChoices.map((c: any) => c.name).join(', ')}</div>` : ''}
                      </div>
                      <span style="color: #2d6a4f; font-weight: bold;">${(item.price * item.quantity).toFixed(2)}€</span>
                    </div>
                  </div>
                `).join('')}
              </div>
              
              <div style="background: #2d6a4f; color: white; padding: 20px; border-radius: 8px; text-align: right;">
                <p style="margin: 5px 0; font-size: 14px;">Sous-total : ${parseFloat(metadata.subtotal).toFixed(2)}€</p>
                ${parseFloat(metadata.deliveryFee) > 0 ? `<p style="margin: 5px 0; font-size: 14px;">Frais de livraison : ${parseFloat(metadata.deliveryFee).toFixed(2)}€</p>` : ''}
                <p style="margin: 15px 0 0 0; font-size: 24px; font-weight: bold;">Total : ${parseFloat(metadata.totalAmount).toFixed(2)}€</p>
              </div>
            </div>
          </div>
        `,
      };

      // Email au client
      const clientEmail = {
        from: `"Les Saveurs du Maghreb" <${process.env.GMAIL_USER}>`,
        to: session.customer_email!,
        subject: `✅ Confirmation de votre commande #${orderCode} - Les Saveurs du Maghreb`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #2d6a4f 0%, #1b4332 100%); padding: 30px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 28px;">🍽️ Les Saveurs du Maghreb</h1>
              <p style="color: #d8f3dc; margin: 10px 0 0 0; font-size: 14px;">Restaurant Maghrébin - Nancy</p>
            </div>
            
            <div style="padding: 30px; background-color: #f8f9fa;">
              <div style="background: #d1fae5; border-left: 4px solid #2d6a4f; padding: 15px; border-radius: 4px; margin-bottom: 20px;">
                <h2 style="color: #2d6a4f; margin: 0 0 10px 0; font-size: 20px;">✅ Commande confirmée !</h2>
                <p style="margin: 0; color: #1f2937;">Votre commande #${orderCode} a bien été reçue et sera préparée dans les plus brefs délais.</p>
              </div>
              
              <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                <h3 style="margin: 0 0 15px 0; color: #1f2937;">📦 Récapitulatif</h3>
                ${orderData.map((item: any) => `
                  <div style="padding: 10px 0; border-bottom: 1px solid #e5e7eb;">
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                      <div>
                        <strong style="color: #1f2937;">${item.quantity}x ${item.name}</strong>
                        ${item.options?.selectedChoices ? `<div style="color: #6b7280; font-size: 13px; margin-top: 4px;">${item.options.selectedChoices.map((c: any) => c.name).join(', ')}</div>` : ''}
                      </div>
                      <span style="color: #2d6a4f; font-weight: bold;">${(item.price * item.quantity).toFixed(2)}€</span>
                    </div>
                  </div>
                `).join('')}
                
                <div style="margin-top: 15px; padding-top: 15px; border-top: 2px solid #2d6a4f;">
                  <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                    <span>Sous-total</span>
                    <span>${parseFloat(metadata.subtotal).toFixed(2)}€</span>
                  </div>
                  ${parseFloat(metadata.deliveryFee) > 0 ? `
                    <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                      <span>Frais de livraison</span>
                      <span>${parseFloat(metadata.deliveryFee).toFixed(2)}€</span>
                    </div>
                  ` : ''}
                  <div style="display: flex; justify-content: space-between; font-size: 20px; font-weight: bold; color: #2d6a4f; margin-top: 10px;">
                    <span>Total</span>
                    <span>${parseFloat(metadata.totalAmount).toFixed(2)}€</span>
                  </div>
                </div>
              </div>
              
              <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                <h3 style="margin: 0 0 15px 0; color: #1f2937;">📍 Informations</h3>
                <p style="margin: 5px 0; color: #4b5563;"><strong>Type :</strong> ${metadata.orderType === 'delivery' ? 'Livraison' : 'À emporter'}</p>
                ${metadata.orderType === 'delivery' ? `
                  <p style="margin: 5px 0; color: #4b5563;"><strong>Adresse :</strong> ${metadata.deliveryAddress}, ${metadata.deliveryZipCode} ${metadata.deliveryCity}</p>
                ` : `
                  <p style="margin: 5px 0; color: #4b5563;"><strong>À retirer à :</strong> 21 Rue des Maréchaux, 54000 Nancy</p>
                `}
                ${metadata.instructions ? `<p style="margin: 5px 0; color: #4b5563; font-style: italic;"><strong>Vos instructions :</strong> ${metadata.instructions}</p>` : ''}
              </div>
              
              <div style="background: #f3f4f6; padding: 15px; border-radius: 8px; text-align: center;">
                <p style="margin: 0; color: #4b5563;">
                  <strong>📞 Besoin d'aide ?</strong><br/>
                  Contactez-nous au 03 83 32 10 30 ou répondez directement à cet email.
                </p>
              </div>
              
              <p style="text-align: center; color: #6b7280; font-size: 14px; margin-top: 20px;">
                Merci de votre confiance !<br/>
                L'équipe des Saveurs du Maghreb
              </p>
            </div>
          </div>
        `,
      };

      await transporter.sendMail(restaurantEmail);
      await transporter.sendMail(clientEmail);
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ received: true }),
    };
  } catch (error: any) {
    console.error('Webhook error:', error);
    return {
      statusCode: 400,
      body: JSON.stringify({ error: error.message }),
    };
  }
};

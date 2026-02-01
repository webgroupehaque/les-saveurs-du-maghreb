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
  console.log('🔔 Webhook Stripe appelé !');
  console.log('📥 Headers:', JSON.stringify(event.headers, null, 2));
  console.log('📦 Body length:', event.body?.length || 0);
  
  const sig = event.headers['stripe-signature']!;

  try {
    const stripeEvent = stripe.webhooks.constructEvent(
      event.body!,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );

    console.log('✅ Webhook Stripe validé !');
    console.log('📋 Event type:', stripeEvent.type);

    if (stripeEvent.type === 'checkout.session.completed') {
      const session = stripeEvent.data.object as Stripe.Checkout.Session;
      const metadata = session.metadata!;

      console.log('📥 Webhook reçu pour restaurant:', metadata.restaurantId);
      console.log('📋 Metadata complètes:', JSON.stringify(metadata, null, 2));
      console.log('🔍 Session ID:', session.id);
      console.log('📧 Customer email:', session.customer_email);

      // ✅ FILTRE : Ignore les commandes qui ne sont pas pour ce restaurant
      if (metadata.restaurantId !== 'saveurs-maghreb') {
        console.log(`⚠️ Webhook ignoré : commande pour "${metadata.restaurantId}", pas pour "saveurs-maghreb"`);
        console.log(`🔍 Comparaison: "${metadata.restaurantId}" !== "saveurs-maghreb" = ${metadata.restaurantId !== 'saveurs-maghreb'}`);
        return {
          statusCode: 200,
          body: JSON.stringify({ 
            received: true, 
            ignored: true,
            reason: 'Not for this restaurant',
            receivedRestaurantId: metadata.restaurantId
          })
        };
      }

      console.log('✅ Restaurant ID valide, traitement de la commande...');

      // Récupérer les line items complets depuis Stripe (plus fiable que les metadata)
      const lineItemsResponse = await stripe.checkout.sessions.listLineItems(session.id, {
        expand: ['data.price.product']
      });
      
      // Reconstruire les items depuis les line items Stripe (exclure les frais de livraison)
      const orderData = lineItemsResponse.data
        .filter(item => {
          // Exclure les frais de livraison
          if (item.price?.product && typeof item.price.product === 'object' && 'name' in item.price.product) {
            const product = item.price.product as Stripe.Product;
            return product.name !== 'Frais de livraison';
          }
          return false;
        })
        .map(item => {
          const product = item.price!.product as Stripe.Product;
          return {
            id: product.metadata?.itemId || `item-${Math.random()}`,
            name: product.name,
            quantity: item.quantity || 1,
            price: (item.price!.unit_amount || 0) / 100,
            category: product.metadata?.category || '',
            image: undefined, // Les images ne sont pas stockées dans Stripe
            options: product.metadata?.choices ? { 
              selectedChoices: JSON.parse(product.metadata.choices) 
            } : undefined
          };
        });

      // Générer un code de commande unique
      const orderCode = String(Math.floor(1000 + Math.random() * 9000));
      console.log('🎲 Code de commande généré:', orderCode);
      console.log('📦 Nombre d\'articles:', orderData.length);

      // Sauvegarder dans Supabase
      const orderToInsert = {
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
      };

      console.log('💾 Tentative d\'insertion dans Supabase...');
      console.log('📋 Données à insérer:', JSON.stringify(orderToInsert, null, 2));

      const { data: insertedData, error: dbError } = await supabase.from('orders').insert(orderToInsert);

      console.log('💾 Supabase insert result:', { 
        insertedData: insertedData ? 'Success' : 'No data returned',
        error: dbError ? dbError.message : null 
      });

      if (dbError) {
        console.error('❌ Supabase error:', dbError);
        console.error('❌ Error details:', JSON.stringify(dbError, null, 2));
      } else {
        console.log('✅ Commande sauvegardée dans Supabase !');
        console.log('✅ Order code:', orderCode);
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
              
              <div style="background: #fef3c7; border: 3px solid #f59e0b; border-radius: 12px; padding: 20px; margin: 20px 0; text-align: center;">
                <p style="margin: 0 0 10px 0; color: #92400e; font-size: 16px; font-weight: bold;">📋 NUMÉRO DE COMMANDE</p>
                <p style="margin: 0; font-size: 48px; font-weight: bold; color: #f59e0b; letter-spacing: 3px;">
                  #${orderCode}
                </p>
                <p style="margin: 10px 0 0 0; color: #92400e; font-size: 14px;">
                  À communiquer au client si besoin
                </p>
              </div>
              
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
                <p style="margin: 0; color: #1f2937;">Votre commande a bien été reçue et sera préparée dans les plus brefs délais.</p>
                <p style="margin: 10px 0 0 0; color: #1f2937; font-weight: bold;">Merci de communiquer votre numéro de commande ci-dessous lors de la réception.</p>
              </div>
              
              <div style="background: #d1fae5; border: 3px solid #2d6a4f; border-radius: 12px; padding: 20px; margin: 20px 0; text-align: center;">
                <p style="margin: 0 0 10px 0; color: #1b4332; font-size: 16px; font-weight: bold;">📋 VOTRE NUMÉRO DE COMMANDE</p>
                <p style="margin: 0; font-size: 48px; font-weight: bold; color: #2d6a4f; letter-spacing: 3px;">
                  #${orderCode}
                </p>
                <p style="margin: 10px 0 0 0; color: #1b4332; font-size: 14px;">
                  Conservez ce numéro pour le suivi de votre commande
                </p>
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

      console.log('📧 Envoi des emails...');
      await transporter.sendMail(restaurantEmail);
      console.log('✅ Email restaurateur envoyé');
      await transporter.sendMail(clientEmail);
      console.log('✅ Email client envoyé');
      console.log('🎉 Commande traitée avec succès !');
    } else {
      console.log('ℹ️ Event type non géré:', stripeEvent.type);
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ received: true }),
    };
  } catch (error: any) {
    console.error('❌ Webhook error:', error);
    console.error('❌ Error stack:', error.stack);
    console.error('❌ Error message:', error.message);
    return {
      statusCode: 400,
      body: JSON.stringify({ error: error.message }),
    };
  }
};

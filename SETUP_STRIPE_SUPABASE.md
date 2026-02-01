# Configuration Stripe, Supabase et Emails

## 📋 Variables d'environnement nécessaires

### Pour le développement local (.env.local)

Créez un fichier `.env.local` à la racine du projet avec :

```env
# Stripe
VITE_STRIPE_PUBLIC_KEY=pk_test_...

# Supabase
VITE_SUPABASE_URL=https://votre-projet.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Pour Netlify (Variables d'environnement)

Dans les paramètres Netlify, ajoutez ces variables :

**Stripe :**
- `STRIPE_SECRET_KEY` : Votre clé secrète Stripe (sk_test_... ou sk_live_...)
- `STRIPE_WEBHOOK_SECRET` : Le secret du webhook Stripe (whsec_...)

**Supabase :**
- `SUPABASE_URL` : L'URL de votre projet Supabase
- `SUPABASE_SERVICE_KEY` : La clé de service (service_role key, pas l'anon key)

**Gmail (pour les emails) :**
- `GMAIL_USER` : Votre adresse Gmail (ex: lessaveursdumaghreb16@gmail.com)
- `GMAIL_PASSWORD` : Un mot de passe d'application Gmail (pas votre mot de passe normal)
- `RESTAURANT_EMAIL` : Email où recevoir les commandes (par défaut: lessaveursdumaghreb16@gmail.com)

## 🗄️ Configuration Supabase

### Créer la table `orders`

Exécutez cette requête SQL dans l'éditeur SQL de Supabase :

```sql
CREATE TABLE orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  restaurant_id TEXT NOT NULL,
  order_code TEXT NOT NULL UNIQUE,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  delivery_address TEXT,
  delivery_city TEXT,
  delivery_zip_code TEXT,
  order_type TEXT NOT NULL CHECK (order_type IN ('delivery', 'takeaway')),
  instructions TEXT,
  items JSONB NOT NULL,
  subtotal DECIMAL(10, 2) NOT NULL,
  delivery_fee DECIMAL(10, 2) NOT NULL,
  total_amount DECIMAL(10, 2) NOT NULL,
  payment_status TEXT NOT NULL DEFAULT 'pending',
  stripe_session_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index pour les recherches rapides
CREATE INDEX idx_orders_restaurant_id ON orders(restaurant_id);
CREATE INDEX idx_orders_order_code ON orders(order_code);
CREATE INDEX idx_orders_created_at ON orders(created_at DESC);
```

## 🔗 Configuration Stripe Webhook

1. Allez dans Stripe Dashboard > Webhooks
2. Ajoutez un endpoint : `https://votre-site.netlify.app/.netlify/functions/stripe-webhook`
3. Sélectionnez l'événement : `checkout.session.completed`
4. Copiez le "Signing secret" et ajoutez-le dans Netlify comme `STRIPE_WEBHOOK_SECRET`

## 📧 Configuration Gmail

Pour envoyer des emails via Gmail :

1. Activez la validation en 2 étapes sur votre compte Gmail
2. Générez un "Mot de passe d'application" :
   - Allez dans votre compte Google > Sécurité
   - Activez la validation en 2 étapes
   - Créez un "Mot de passe d'application"
   - Utilisez ce mot de passe (pas votre mot de passe normal) dans `GMAIL_PASSWORD`

## ✅ Vérification

Une fois tout configuré :

1. Testez une commande avec une carte de test Stripe : `4242 4242 4242 4242`
2. Vérifiez que la commande est sauvegardée dans Supabase
3. Vérifiez que les emails sont envoyés (client + restaurateur)

## 🚀 Déploiement

1. Poussez votre code sur GitHub
2. Connectez le repo à Netlify
3. Ajoutez toutes les variables d'environnement dans Netlify
4. Déployez !

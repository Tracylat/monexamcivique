# 🔐 Intégration Stripe - Guide Complet

## 1️⃣ Configuration des clés Stripe

### Obtenir vos clés :
1. Allez sur [Stripe Dashboard](https://dashboard.stripe.com)
2. Connectez-vous ou créez un compte
3. Allez dans **Developers** → **API Keys**
4. Copiez :
   - **Publishable key** (clé publique) → `STRIPE_PUBLIC_KEY` dans le frontend
   - **Secret key** (clé secrète) → `STRIPE_SECRET_KEY` dans le backend

### Mettre à jour les fichiers :

**Frontend** (`src/config/stripe.ts`) :
```typescript
export const STRIPE_PUBLIC_KEY = "pk_live_VOTRE_CLÉ_ICI"; // À remplacer
```

**Backend** (`.env`) :
```
STRIPE_SECRET_KEY=sk_live_VOTRE_CLÉ_ICI
```

## 2️⃣ Configuration du Webhook Stripe

### Créer un webhook :
1. Allez dans [Webhooks](https://dashboard.stripe.com/webhooks)
2. Cliquez sur **Add an endpoint**
3. URL du webhook : `https://votre-domaine.com/api/payment/webhook`
4. Événements à écouter :
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
   - `charge.refunded`
5. Copiez la clé secrète → `STRIPE_WEBHOOK_SECRET` dans `.env`

## 3️⃣ Tester avec les cartes de test Stripe

### Cartes de test :
- **Succès** : `4242 4242 4242 4242`
- **Décline** : `4000 0000 0000 0002`
- **Authentification 3D Secure** : `4000 0025 0000 3155`

Date expiration : `12/26` (ou plus tard)
CVC : `123` (n'importe quel 3 chiffres)

## 4️⃣ Lancer le serveur backend

```bash
# Installer les dépendances
npm install

# Copier et configurer .env
cp .env.example .env

# Lancer le serveur
npm run dev:backend

# Ou avec node
node backend/server.js
```

Le serveur écoute sur `http://localhost:5000`

## 5️⃣ Flux de paiement

1. Utilisateur entre ses informations
2. Frontend crée un **PaymentIntent** via `/api/payment/create-intent`
3. Utilisateur entre les détails de sa carte
4. Frontend confirme le paiement avec `stripe.confirmCardPayment()`
5. Stripe envoie le webhook si succès
6. Backend met à jour la base de données utilisateur
7. Frontend redirige vers `/app`

## 6️⃣ En production

### Gérer les secrets :
```bash
# Ne JAMAIS commiter vos clés !
echo ".env" >> .gitignore

# Sur votre serveur, utilisez les variables d'environnement
export STRIPE_SECRET_KEY="sk_live_xxx"
export STRIPE_PUBLIC_KEY="pk_live_xxx"
```

### Passer aux clés Live Stripe :
1. Dans Stripe Dashboard, passez du mode **Test** au mode **Live**
2. Copiez vos clés **Live** (commence par `pk_live_` et `sk_live_`)
3. Mettez à jour vos configurations

### Configuration HTTPS obligatoire :
Stripe n'accepte les paiements qu'en HTTPS en production.

## 7️⃣ Troubleshooting

### "Invalid API Key"
- Vérifiez que `STRIPE_SECRET_KEY` est correcte
- Utilisez la bonne clé (live ou test)

### "Webhook failed"
- Vérifiez que votre serveur backend est accessible
- Testez avec : `curl http://localhost:5000/health`

### Paiement qui ne passe pas
- Utilisez les cartes de test Stripe
- Vérifiez les logs du backend
- Consultez les événements Stripe dans le Dashboard

## 📚 Documentation utile
- [Stripe Payment Intents](https://stripe.com/docs/payments/payment-intents)
- [Stripe Elements](https://stripe.com/docs/stripe-js/elements/payment-request-button)
- [Test cards](https://stripe.com/docs/testing)
- [Webhooks](https://stripe.com/docs/webhooks)

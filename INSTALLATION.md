# Mon Examen Civique - Guide d'installation Stripe

## ✅ Checklist d'intégration

- [ ] Créer un compte Stripe
- [ ] Obtenir les clés API Stripe
- [ ] Configurer les variables d'environnement
- [ ] Installer les dépendances du backend
- [ ] Tester le paiement en mode Test
- [ ] Configurer le webhook Stripe
- [ ] Passer en mode Live (production)

## 🔧 Installation rapide

### 1. Variables d'environnement

Créez un fichier `.env` à la racine du projet :

```
VITE_API_URL=http://localhost:5000
```

Créez un fichier `backend/.env` :

```
PORT=5000
FRONTEND_URL=http://localhost:5173
STRIPE_SECRET_KEY=sk_test_YOUR_KEY
STRIPE_PUBLIC_KEY=pk_test_YOUR_KEY
STRIPE_WEBHOOK_SECRET=whsec_YOUR_SECRET
```

### 2. Installation

```bash
# Frontend
npm install

# Backend
cd backend
npm install
cd ..
```

### 3. Lancer les deux serveurs

Terminal 1 (Frontend) :
```bash
npm run dev
```

Terminal 2 (Backend) :
```bash
cd backend
npm run dev
```

Le frontend écoute sur `http://localhost:5173`
Le backend écoute sur `http://localhost:5000`

## 🧪 Tester avec Stripe

1. Rendez-vous sur la page de checkout
2. Entrez un nom et email
3. Utilisez la carte de test : `4242 4242 4242 4242`
4. Date : `12/26` (ou plus tard)
5. CVC : `123`

Cliquez "Payer 20€" - le paiement devrait être accepté.

## 🚀 Déploiement en production

1. Passez à vos clés Stripe **Live** (commencent par `pk_live_` et `sk_live_`)
2. Déployez votre frontend (Vercel, Netlify, etc.)
3. Déployez votre backend (Heroku, Railway, etc.)
4. Mettez à jour l'URL du webhook Stripe avec votre domaine réel
5. Activez le mode HTTPS

## 📞 Support

Pour toute question sur Stripe :
- [Stripe Docs](https://stripe.com/docs)
- [Stripe Support](https://support.stripe.com)

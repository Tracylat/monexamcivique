// backend/routes/payment.js

import express from 'express';
import Stripe from 'stripe';
import Payment from '../models/Payment.js';
import User from '../models/User.js';

const router = express.Router();
const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
const stripe = stripeSecretKey ? new Stripe(stripeSecretKey) : null;
const FIXED_AMOUNT = Number(process.env.STRIPE_AMOUNT || 2000);
const CURRENCY = process.env.STRIPE_CURRENCY || 'eur';

const stripeNotConfiguredError = (res) =>
  res.status(500).json({
    error: 'Stripe non configure. Definissez STRIPE_SECRET_KEY dans le backend.',
  });

// Créer un PaymentIntent
router.post('/create-intent', async (req, res) => {
  try {
    if (!stripe) {
      return stripeNotConfiguredError(res);
    }

    const { email, name, description } = req.body;

    if (!email || !name) {
      return res.status(400).json({ error: 'Email et name requis' });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      // Ne jamais faire confiance au montant envoyé par le frontend.
      amount: FIXED_AMOUNT,
      currency: CURRENCY,
      description: description || 'Mon Examen Civique',
      receipt_email: email,
      metadata: {
        email,
        name,
      },
    });

    res.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    });
  } catch (error) {
    console.error('Erreur création PaymentIntent:', error);
    res.status(500).json({ error: error.message });
  }
});

// Confirmer le paiement (optionnel - surtout pour vérifier côté serveur)
router.post('/confirm', async (req, res) => {
  try {
    if (!stripe) {
      return stripeNotConfiguredError(res);
    }

    const { paymentIntentId, userId } = req.body;
    if (!paymentIntentId) {
      return res.status(400).json({ error: 'paymentIntentId requis' });
    }
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    if (paymentIntent.status === 'succeeded') {
      // Sauvegarder le paiement
      let payment = await Payment.findOne({ stripePaymentIntentId: paymentIntentId });
      if (!payment) {
        payment = await Payment.create({
          user: userId,
          stripePaymentIntentId: paymentIntentId,
          amount: paymentIntent.amount,
          currency: paymentIntent.currency,
          status: paymentIntent.status,
        });
        // Donner accès premium à l'utilisateur
        if (userId) {
          await User.findByIdAndUpdate(userId, { isPremium: true });
        }
      }
      res.json({
        success: true,
        message: 'Paiement confirmé',
        paymentIntent,
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'Paiement non confirmé',
        status: paymentIntent.status,
      });
    }
  } catch (error) {
    console.error('Erreur confirmation paiement:', error);
    res.status(500).json({ error: error.message });
  }
});

// Webhook pour gérer les événements Stripe
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  if (!stripe) {
    return stripeNotConfiguredError(res);
  }
  if (!webhookSecret) {
    return res.status(500).json({ error: 'Webhook Stripe non configure (STRIPE_WEBHOOK_SECRET manquant).' });
  }

  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      webhookSecret
    );
  } catch (err) {
    console.error('Erreur vérification webhook:', err);
    return res.status(400).send(`Erreur webhook: ${err.message}`);
  }

  // Gérer les événements
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object;
      console.log('✅ Paiement réussi:', paymentIntent.id);
      // À implémenter : mettre à jour la BD avec l'accès utilisateur
      break;

    case 'payment_intent.payment_failed':
      const failedPayment = event.data.object;
      console.log('❌ Paiement échoué:', failedPayment.id);
      // À implémenter : notifier l'utilisateur
      break;

    case 'charge.refunded':
      const refundedCharge = event.data.object;
      console.log('💰 Remboursement effectué:', refundedCharge.id);
      // À implémenter : révoquer l'accès utilisateur
      break;

    default:
      console.log(`Événement non géré: ${event.type}`);
  }

  res.json({ received: true });
});

export default router;

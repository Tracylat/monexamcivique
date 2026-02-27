// Configuration Stripe
export const STRIPE_PUBLIC_KEY = import.meta.env.VITE_STRIPE_PUBLIC_KEY || "";

// À remplacer par votre vraie clé secrète côté backend
export const STRIPE_PRICE_ID = "price_1Qvn0EE7p6opglnGfqVKP8rT"; // À remplacer par votre vrai price ID

const DEFAULT_API_BASE_URL = import.meta.env.DEV
  ? "http://localhost:5001"
  : window.location.origin;

export const API_BASE_URL = (import.meta.env.VITE_API_URL || DEFAULT_API_BASE_URL).replace(/\/$/, "");

export const STRIPE_CONFIG = {
  amount: 2000, // 20€ en centimes
  currency: "eur",
  description: "Accès complet Mon Examen Civique",
};

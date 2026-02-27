// src/utils/stripeTestCards.ts
/**
 * Cartes de test Stripe pour les tests de paiement
 * À utiliser uniquement en développement (mode Test)
 */

export const STRIPE_TEST_CARDS = {
  // Succès
  success: {
    number: "4242 4242 4242 4242",
    exp: "12/26",
    cvc: "123",
    zip: "12345",
    description: "Paiement accepté",
  },

  // Décline
  decline: {
    number: "4000 0000 0000 0002",
    exp: "12/26",
    cvc: "123",
    zip: "12345",
    description: "Paiement refusé par la banque",
  },

  // 3D Secure
  threeDSecure: {
    number: "4000 0025 0000 3155",
    exp: "12/26",
    cvc: "123",
    zip: "12345",
    description: "Demande authentification 3D Secure",
  },

  // Erreur expiration
  expiredCard: {
    number: "4000 0000 0000 0069",
    exp: "12/19", // Date passée
    cvc: "123",
    zip: "12345",
    description: "Carte expirée",
  },

  // Contrôle CVC
  wrongCVC: {
    number: "4000 0000 0000 0127",
    exp: "12/26",
    cvc: "999", // Mauvais CVC
    zip: "12345",
    description: "CVC invalide",
  },

  // Fraud check
  fraudCheck: {
    number: "4100 0000 0000 0019",
    exp: "12/26",
    cvc: "123",
    zip: "12345",
    description: "Décline pour raison de fraude",
  },
};

/**
 * Affiche les cartes de test dans la console
 */
export const printTestCards = () => {
  console.log("🧪 Cartes de test Stripe (Mode Test uniquement):");
  console.log("================================================\n");

  Object.entries(STRIPE_TEST_CARDS).forEach(([key, card]) => {
    console.log(`${key.toUpperCase()}`);
    console.log(`  Numéro: ${card.number}`);
    console.log(`  Expiration: ${card.exp}`);
    console.log(`  CVC: ${card.cvc}`);
    console.log(`  Résultat: ${card.description}\n`);
  });

  console.log("⚠️  Ces cartes ne fonctionnent QUE en mode Test Stripe!");
  console.log("⚠️  En production (mode Live), utilisez des vraies cartes.\n");
};

/**
 * Valide un numéro de carte avec l'algorithme de Luhn
 */
export const validateCardNumber = (cardNumber: string): boolean => {
  const digits = cardNumber.replace(/\D/g, "");
  if (digits.length !== 16) return false;

  let sum = 0;
  let isEven = false;

  for (let i = digits.length - 1; i >= 0; i--) {
    let digit = parseInt(digits[i], 10);

    if (isEven) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }

    sum += digit;
    isEven = !isEven;
  }

  return sum % 10 === 0;
};

/**
 * Détecte le type de carte
 */
export const getCardType = (cardNumber: string): string => {
  const cleaned = cardNumber.replace(/\D/g, "");

  if (/^4/.test(cleaned)) return "Visa";
  if (/^5[1-5]/.test(cleaned)) return "Mastercard";
  if (/^3[47]/.test(cleaned)) return "American Express";
  if (/^6(?:011|5)/.test(cleaned)) return "Discover";

  return "Carte inconnue";
};

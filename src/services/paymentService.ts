import { API_BASE_URL, STRIPE_CONFIG } from "../config/stripe";

export const createPaymentIntent = async (email: string, name: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/payment/create-intent`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        name,
        amount: STRIPE_CONFIG.amount,
        currency: STRIPE_CONFIG.currency,
        description: STRIPE_CONFIG.description,
      }),
    });

    if (!response.ok) {
      throw new Error(`Erreur API: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Erreur création PaymentIntent:", error);
    throw error;
  }
};

export const confirmPayment = async (paymentIntentId: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/payment/confirm`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ paymentIntentId }),
    });

    if (!response.ok) {
      throw new Error(`Erreur confirmation: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Erreur confirmation paiement:", error);
    throw error;
  }
};

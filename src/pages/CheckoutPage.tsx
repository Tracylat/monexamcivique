import React, { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { useTranslation } from 'react-i18next';
import { usePayment } from "../context/PaymentContext";
import { useNavigate, useSearchParams } from "react-router-dom";
import { STRIPE_PUBLIC_KEY, API_BASE_URL } from "../config/stripe";
import Header from "../components/Header";
import { normalizePlan, planMap, plans } from "../data/plans";
import { addPurchasedPlan, setSelectedPlan } from "../utils/access";

const stripePromise = loadStripe(STRIPE_PUBLIC_KEY);

const CheckoutForm = () => {
  const { i18n } = useTranslation();
  const tr = (fr: string, en: string) => (i18n.resolvedLanguage === 'en' ? en : fr);
  const stripe = useStripe();
  const elements = useElements();
  const { markAsPaid } = usePayment();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedPlan = normalizePlan(searchParams.get('plan'));
  const selectedPlanInfo = planMap[selectedPlan];
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const stripeKeyMissing = !STRIPE_PUBLIC_KEY;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (stripeKeyMissing) {
      setError(tr("Clé publique Stripe manquante (VITE_STRIPE_PUBLIC_KEY).", "Missing Stripe public key (VITE_STRIPE_PUBLIC_KEY)."));
      return;
    }

    if (!stripe || !elements) {
      setError(tr("Stripe n'est pas chargé", 'Stripe is not loaded'));
      return;
    }

    if (!email || !name) {
      setError(tr('Veuillez remplir tous les champs', 'Please fill all fields'));
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Créer le PaymentIntent côté serveur
      const response = await fetch(`${API_BASE_URL}/api/payment/create-intent`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          name,
          amount: selectedPlanInfo.price * 100,
          currency: "eur",
        }),
      });

      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(payload?.error || tr('Erreur création du paiement', 'Error creating payment'));
      }

      const { clientSecret } = payload;

      // Confirmer le paiement avec la carte
      const cardElement = elements.getElement(CardElement);
      if (!cardElement) {
        throw new Error(tr('Élément carte non trouvé', 'Card element not found'));
      }

      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            email,
            name,
          },
        },
      });

      if (result.error) {
        setError(result.error.message || "Erreur lors du paiement");
      } else if (result.paymentIntent?.status === "succeeded") {
        // Paiement réussi
        markAsPaid();
        addPurchasedPlan(selectedPlan);
        setSelectedPlan(selectedPlan);
        navigate("/app");
      } else {
        setError(tr("Le paiement n'a pas abouti", 'Payment did not complete'));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : tr('Erreur lors du paiement', 'Payment error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-indigo-50 to-slate-100 px-4 py-8 sm:py-12">
      <div className="mx-auto grid w-full max-w-5xl grid-cols-1 gap-6 lg:grid-cols-[1.05fr_1fr]">
        <div className="rounded-2xl bg-white p-5 shadow-xl sm:p-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-center mb-2 text-gray-800">{tr('Paiement sécurisé', 'Secure payment')}</h1>
          <p className="text-center text-sm sm:text-base text-gray-600 mb-7">{tr('Accès illimité à Mon Examen Civique', 'Unlimited access to My Civic Exam')}</p>

          <div className="mb-6">
            <p className="mb-3 text-sm font-semibold text-gray-700">{tr('Choisir la formation', 'Choose training')}</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {plans.map((plan) => (
                <button
                  key={plan.id}
                  type="button"
                  onClick={() => setSearchParams({ plan: plan.id })}
                  className={`rounded-lg border px-3 py-2 text-sm font-semibold transition ${
                    selectedPlan === plan.id
                      ? 'border-[#1a4d8f] bg-[#eef6ff] text-[#1a4d8f]'
                      : 'border-gray-200 bg-white text-gray-700 hover:border-[#1a4d8f]'
                  }`}
                >
                  {plan.icon} {plan.id}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-8 p-5 sm:p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
            <div className="flex justify-between items-center mb-4 gap-2">
              <span className="text-gray-700 font-semibold text-sm sm:text-base">
                {tr('Formation choisie', 'Selected training')}: {selectedPlan}
              </span>
              <span className="text-2xl sm:text-3xl font-bold text-indigo-600">{selectedPlanInfo.price}€</span>
            </div>
            <div className="text-sm text-gray-600 space-y-2">
              {selectedPlanInfo.featuresFr.slice(0, 3).map((featureFr, index) => (
                <div key={`${selectedPlan}-feature-${index}`}>✓ {tr(featureFr, selectedPlanInfo.featuresEn[index])}</div>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
          {stripeKeyMissing && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-700">
                {tr("Configuration Stripe incomplète : ajoutez VITE_STRIPE_PUBLIC_KEY dans .env", "Incomplete Stripe config: add VITE_STRIPE_PUBLIC_KEY in .env")}
              </p>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {tr('Nom complet', 'Full name')}
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={tr('Jean Dupont', 'John Doe')}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {tr('Email', 'Email')}
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={tr('votre@email.com', 'your@email.com')}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {tr('Informations de carte', 'Card details')}
            </label>
            <div className="border border-gray-300 rounded-lg p-4 bg-white">
              <CardElement
                options={{
                  disableLink: true,
                  style: {
                    base: {
                      fontSize: "16px",
                      color: "#424770",
                      fontFamily: "system-ui, -apple-system, sans-serif",
                    },
                    invalid: {
                      color: "#d32f2f",
                    },
                  },
                }}
              />
            </div>
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

            <button
              type="submit"
              disabled={loading || !stripe || stripeKeyMissing}
              className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? tr('Traitement...', 'Processing...') : tr(`Payer ${selectedPlanInfo.price}€`, `Pay EUR ${selectedPlanInfo.price}`)}
            </button>

          </form>

          <p className="text-center text-xs text-gray-500 mt-6">
            🔒 {tr('Paiement sécurisé par Stripe • Garantie 30 jours • Aucun engagement', 'Secure payment by Stripe • 30-day guarantee • No commitment')}
          </p>
        </div>

        <div className="rounded-2xl bg-[#0f3466] p-6 text-white shadow-xl sm:p-8">
          <div className="text-5xl mb-4">{selectedPlanInfo.icon}</div>
          <h2 className="text-2xl sm:text-3xl font-bold mb-3">{tr(selectedPlanInfo.labelFr, selectedPlanInfo.labelEn)}</h2>
          <p className="text-sm sm:text-base text-white/85 mb-5">{tr(selectedPlanInfo.descriptionFr, selectedPlanInfo.descriptionEn)}</p>
          <p className="text-sm text-white/80 mb-6">{tr(selectedPlanInfo.durationFr, selectedPlanInfo.durationEn)}</p>
          <div className="space-y-3">
            {selectedPlanInfo.featuresFr.map((featureFr, index) => (
              <div key={`${selectedPlan}-all-feature-${index}`} className="rounded-lg bg-white/10 px-3 py-2 text-sm">
                ✓ {tr(featureFr, selectedPlanInfo.featuresEn[index])}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default function CheckoutPage() {
  return (
    <>
      <Header />
      <Elements stripe={stripePromise}>
        <CheckoutForm />
      </Elements>
    </>
  );
}

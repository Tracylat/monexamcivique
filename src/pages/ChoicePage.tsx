import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { TitleType, plans } from '../data/plans';
import { enableDemoAccess } from '../utils/access';

export default function ChoicePage() {
  const navigate = useNavigate();
  const { i18n } = useTranslation();
  const tr = (fr: string, en: string) => (i18n.resolvedLanguage === 'en' ? en : fr);
  const openCheckout = (plan: TitleType) => {
    navigate(`/checkout?plan=${encodeURIComponent(plan)}`);
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-b from-blue-50 via-blue-100 to-white px-4 py-8 sm:py-12">
        <div className="mx-auto w-full max-w-6xl">
          <div className="text-center mb-10 sm:mb-12">
            <h1 className="text-3xl sm:text-4xl font-bold text-[#0f3466] mb-4">{tr('Bienvenue !', 'Welcome!')} 🎉</h1>
            <p className="text-base sm:text-xl text-gray-600">
              {tr('Choisissez votre formation complète selon votre objectif', 'Choose your complete training according to your goal')}
            </p>
            <button
              type="button"
              onClick={() => {
                enableDemoAccess();
                navigate('/choice');
              }}
              className="mt-4 rounded-lg border border-[#d7e3f4] bg-white px-4 py-2 text-sm font-semibold text-[#1a4d8f] hover:bg-[#eef4fb]"
            >
              {tr('Activer le mode test (sans connexion)', 'Enable test mode (no login)')}
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 sm:gap-7">
            {plans.map((plan) => {
              const isResident = plan.id === 'Résident';
              return (
                <div
                  key={plan.id}
                  className={`rounded-2xl p-5 sm:p-7 border-2 shadow-lg transition-all duration-300 cursor-pointer hover:shadow-2xl ${plan.cardStyle}`}
                  onClick={() => openCheckout(plan.id)}
                >
                  {isResident && (
                    <div className="mb-4 inline-flex items-center rounded-full bg-white px-3 py-1 text-xs font-bold text-[#d72638]">
                      {tr('RECOMMANDÉ', 'RECOMMENDED')}
                    </div>
                  )}
                  <div className="text-4xl sm:text-5xl mb-4">{plan.icon}</div>
                  <h2 className={`text-xl sm:text-2xl font-bold mb-2 ${isResident ? 'text-white' : 'text-[#1a1a1a]'}`}>
                    {tr(plan.labelFr, plan.labelEn)}
                  </h2>
                  <p className={`text-sm sm:text-base mb-2 ${isResident ? 'text-white/90' : 'text-gray-600'}`}>
                    {tr(plan.durationFr, plan.durationEn)}
                  </p>
                  <p className={`mb-5 text-sm sm:text-base ${isResident ? 'text-white/90' : 'text-gray-600'}`}>
                    {tr(plan.descriptionFr, plan.descriptionEn)}
                  </p>

                  <div className={`rounded-lg p-4 mb-6 ${isResident ? 'bg-white/20' : 'bg-gray-50'}`}>
                    <div className={`font-semibold mb-3 ${isResident ? 'text-white' : 'text-gray-700'}`}>{tr('Inclus :', 'Included:')}</div>
                    <ul className={`space-y-2 text-sm ${isResident ? 'text-white/90' : 'text-gray-600'}`}>
                      {plan.featuresFr.map((featureFr, index) => (
                        <li key={`${plan.id}-${index}`}>✓ {tr(featureFr, plan.featuresEn[index])}</li>
                      ))}
                    </ul>
                  </div>

                  <div className={`text-center mb-4 ${isResident ? 'text-white' : 'text-[#1a4d8f]'}`}>
                    <div className="text-3xl font-bold">{plan.price}€</div>
                  </div>

                  <button className={`w-full py-3 rounded-lg font-semibold transition ${plan.buttonStyle}`}>
                    {tr(`Choisir ${plan.id}`, `Choose ${plan.id}`)} →
                  </button>
                </div>
              );
            })}
          </div>

          <div className="text-center mt-12 text-gray-600">
            <p className="text-sm">
              🔒 {tr('Paiement sécurisé • 3 formations complètes différentes', 'Secure payment • 3 different complete trainings')}
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

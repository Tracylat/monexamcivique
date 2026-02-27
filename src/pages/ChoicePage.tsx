import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function ChoicePage() {
  const navigate = useNavigate();
  const { i18n } = useTranslation();
  const tr = (fr: string, en: string) => (i18n.resolvedLanguage === 'en' ? en : fr);

  return (
    <>
      <Header />
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-50 to-indigo-100 p-4">
        <div className="max-w-[1000px] w-full">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-[#0f3466] mb-4">{tr('Bienvenue !', 'Welcome!')} 🎉</h1>
            <p className="text-xl text-gray-600">{tr('Choisissez comment vous voulez commencer', 'Choose how you want to start')}</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* OPTION 1: ESSAI GRATUIT */}
            <div
              className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-2xl transition-all cursor-pointer border-2 border-gray-200 hover:border-[#2d6a4f]"
              onClick={() => navigate('/app/free')}
            >
              <div className="text-5xl mb-4">🆓</div>
              <h2 className="text-2xl font-bold text-[#1a1a1a] mb-3">{tr('Essai Gratuit', 'Free Trial')}</h2>
              <p className="text-gray-600 mb-6">
                {tr("Testez le format de l'examen sans engagement", 'Try the exam format with no commitment')}
              </p>
              
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <div className="font-semibold text-gray-700 mb-3">{tr('Inclus :', 'Included:')}</div>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>{tr('✓ Mini quiz (10 questions)', '✓ Mini quiz (10 questions)')}</li>
                  <li>{tr("✓ Format officiel de l'examen", '✓ Official exam format')}</li>
                  <li>{tr('✓ Explications détaillées', '✓ Detailed explanations')}</li>
                  <li>{tr('✓ Sans inscription CB requise', '✓ No card required')}</li>
                </ul>
              </div>

              <button className="w-full bg-[#2d6a4f] text-white py-3 rounded-lg font-semibold hover:bg-[#1b4332] transition">
                {tr("Commencer l'essai gratuit", 'Start free trial')} →
              </button>
            </div>

            {/* OPTION 2: ACCÈS COMPLET */}
            <div
              className="bg-gradient-to-br from-[#ff6b35] to-[#ff8f6b] rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-all cursor-pointer relative overflow-hidden"
              onClick={() => navigate('/checkout')}
            >
              <div className="absolute top-4 right-4 bg-white text-[#ff6b35] font-bold px-4 py-1 rounded-full text-sm">
                {tr('RECOMMANDÉ', 'RECOMMENDED')}
              </div>
              
              <div className="text-5xl mb-4">⭐</div>
              <h2 className="text-2xl font-bold text-white mb-3">{tr('Accès Complet', 'Full Access')}</h2>
              <p className="text-white/90 mb-6">
                {tr('Préparation complète avec toutes les ressources', 'Complete preparation with all resources')}
              </p>
              
              <div className="bg-white/20 rounded-lg p-4 mb-6">
                <div className="font-semibold text-white mb-3">{tr('Inclus :', 'Included:')}</div>
                <ul className="space-y-2 text-sm text-white/90">
                  <li>{tr('✓ 200+ questions de révision', '✓ 200+ review questions')}</li>
                  <li>{tr('✓ 5 examens blancs complets', '✓ 5 full mock exams')}</li>
                  <li>{tr('✓ Fiches de révision interactives', '✓ Interactive revision cards')}</li>
                  <li>{tr('✓ Mises en situation réalistes', '✓ Realistic scenarios')}</li>
                  <li>{tr('✓ Suivi de progression', '✓ Progress tracking')}</li>
                  <li>{tr('✓ Accès illimité', '✓ Unlimited access')}</li>
                </ul>
              </div>

              <div className="text-white text-center mb-4">
                <div className="text-3xl font-bold">20€</div>
                <div className="text-sm">{tr('Paiement unique • Accès à vie', 'One-time payment • Lifetime access')}</div>
              </div>

              <button className="w-full bg-white text-[#ff6b35] py-3 rounded-lg font-bold hover:bg-gray-100 transition">
                {tr("Débloquer l'accès complet", 'Unlock full access')} →
              </button>
            </div>
          </div>

          <div className="text-center mt-12 text-gray-600">
            <p className="text-sm">🔒 {tr('Paiement sécurisé • Garantie 30 jours • Sans engagement', 'Secure payment • 30-day guarantee • No commitment')}</p>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

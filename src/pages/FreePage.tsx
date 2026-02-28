import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Header from '../components/Header';
import { questionsByLevel } from '../data/questions';
import { plans, TitleType } from '../data/plans';

type ViewState = 'quiz' | 'results';

const FreePage: React.FC = () => {
  const navigate = useNavigate();
  const { i18n } = useTranslation();
  const tr = (fr: string, en: string) => (i18n.resolvedLanguage === 'en' ? en : fr);
  const [view, setView] = useState<ViewState>('quiz');
  const [selectedTitle, setSelectedTitle] = useState<TitleType>('CSP');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<number[]>([]);
  const [quizScore, setQuizScore] = useState(0);

  const handleAnswerSelect = (answerIndex: number) => {
    const newAnswers = [...userAnswers];
    newAnswers[currentQuestionIndex] = answerIndex;
    setUserAnswers(newAnswers);
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < 9) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      calculateScore();
    }
  };

  const calculateScore = () => {
    let score = 0;
    const questions = questionsByLevel[selectedTitle].slice(0, 10);
    userAnswers.forEach((ans, idx) => {
      if (ans === questions[idx]?.correct) score++;
    });
    setQuizScore(score);
    setView('results');
  };

  return (
    <>
      <Header />
      
      {view === 'quiz' && (
        <div className="max-w-[1200px] mx-auto p-4 sm:p-6 lg:p-8">
          <div className="bg-gradient-to-br from-[#1a4d8f] to-[#0f3466] text-white p-6 sm:p-10 rounded-[20px] text-center mb-8 sm:mb-12">
            <h2 className="font-heading text-3xl sm:text-[2.6rem] font-extrabold mb-4">📚 {tr('ÉVALUATION GRATUITE', 'FREE ASSESSMENT')}</h2>
            <p className="text-lg sm:text-[1.3rem] mt-4">{tr('Testez vos chances de réussite', 'Test your chances of success')}</p>
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-2">
              {plans.map((plan) => (
                <button
                  key={plan.id}
                  type="button"
                  onClick={() => setSelectedTitle(plan.id)}
                  className={`rounded-lg px-3 py-2 text-sm font-semibold transition ${
                    selectedTitle === plan.id ? 'bg-white text-[#1a4d8f]' : 'bg-white/15 text-white hover:bg-white/25'
                  }`}
                >
                  {plan.icon} {plan.id}
                </button>
              ))}
            </div>
            <div className="bg-[rgba(255,255,255,0.2)] rounded-full h-3 max-w-[500px] mx-auto mt-8 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-[#ff6b35] to-[#ff8f6b] rounded-full transition-all duration-400"
                style={{ width: `${((currentQuestionIndex) / 10) * 100}%` }}
              ></div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 sm:p-10 shadow-[0_8px_24px_rgba(0,0,0,0.08)] mb-8">
            <div className="font-heading text-[#ff6b35] font-bold text-base sm:text-lg mb-4 uppercase tracking-wider">
              {tr('Question', 'Question')} {currentQuestionIndex + 1}/10
            </div>
            <div className="font-heading text-2xl sm:text-[2rem] font-bold text-[#1a1a1a] mb-8 leading-tight">
              {questionsByLevel[selectedTitle][currentQuestionIndex]?.q}
            </div>
            <div className="grid gap-4">
              {questionsByLevel[selectedTitle][currentQuestionIndex]?.answers?.map((answer, idx) => (
                <div 
                  key={idx}
                  className={`p-4 sm:p-6 border-2 rounded-xl cursor-pointer transition-all text-base sm:text-lg font-medium flex items-center
                    ${userAnswers[currentQuestionIndex] === idx 
                      ? 'border-[#1a4d8f] bg-[#f0f9ff] text-[#1a4d8f] shadow-md transform -translate-y-1' 
                      : 'border-[#e2e8f0] hover:border-[#cbd5e1] hover:bg-[#f8fafc]'
                    }`}
                  onClick={() => handleAnswerSelect(idx)}
                >
                  <div className={`w-6 h-6 rounded-full border-2 mr-4 flex items-center justify-center
                    ${userAnswers[currentQuestionIndex] === idx ? 'border-[#1a4d8f]' : 'border-[#cbd5e1]'}`}>
                    {userAnswers[currentQuestionIndex] === idx && <div className="w-3 h-3 bg-[#1a4d8f] rounded-full"></div>}
                  </div>
                  {answer}
                </div>
              ))}
            </div>
          </div>

          <div className="text-center mt-8">
            <button 
              className="btn btn-primary" 
              onClick={nextQuestion}
              disabled={userAnswers[currentQuestionIndex] === undefined}
            >
              {currentQuestionIndex < 9 ? tr('Question suivante', 'Next question') : tr('Voir mes résultats', 'See my results')}
            </button>
          </div>
        </div>
      )}

      {view === 'results' && (
        <div className="max-w-[1200px] mx-auto p-4 sm:p-6 lg:p-8">
          <div className="bg-white rounded-2xl p-6 sm:p-12 shadow-[0_8px_24px_rgba(0,0,0,0.08)] text-center max-w-[800px] mx-auto mb-8">
            <h2 className="font-heading text-3xl sm:text-[2rem] text-gray-600">{tr('Votre score', 'Your score')}</h2>
            <div className="font-heading text-[3.5rem] sm:text-[5rem] font-extrabold text-[#1a4d8f] my-4">{quizScore}/10</div>
            <div className={`font-bold text-xl uppercase tracking-wider mb-6 ${
              quizScore >= 8 ? 'text-[#2d6a4f]' : quizScore >= 5 ? 'text-[#f59e0b]' : 'text-[#d32f2f]'
            }`}>
              {quizScore >= 8 ? tr('✅ BON NIVEAU', '✅ GOOD LEVEL') : quizScore >= 5 ? tr('⚠️ NIVEAU MOYEN', '⚠️ MEDIUM LEVEL') : tr('⚠️ NIVEAU INSUFFISANT', '⚠️ INSUFFICIENT LEVEL')}
            </div>
            <p className="mt-6 text-[1.1rem] text-gray-600">{tr("Score minimum requis à l'examen officiel :", 'Minimum score required in official exam:')} <strong>32/40 (80%)</strong></p>
          </div>

          <div className="bg-gradient-to-br from-[#f0f9ff] to-[#e0f2fe] border-l-4 border-[#1a4d8f] rounded-xl p-5 sm:p-8 my-8 max-w-[800px] mx-auto">
            <h4 className="font-heading text-[#1a4d8f] text-2xl sm:text-[1.5rem] mb-4">💡 {tr('Vous voulez vraiment réussir ?', 'Do you really want to succeed?')}</h4>
            <p className="text-base sm:text-[1.1rem] leading-relaxed mb-6">{tr("Débloquez l'accès complet avec 200+ questions de révision, 5 examens blancs et des fiches interactives.", 'Unlock full access with 200+ review questions, 5 mock exams and interactive cards.')}</p>
            <div className="flex gap-4 flex-wrap">
              <div className="flex-1 bg-white p-6 rounded-xl shadow-sm border border-[#fee2e2]">
                <div className="font-semibold text-[#d32f2f] mb-4">{tr("En cas d'échec", 'In case of failure')}</div>
                <div className="text-[2rem] font-bold text-[#d32f2f] mb-2">225€+</div>
                <div className="text-sm text-gray-600">{tr("Nouveaux timbres fiscaux + 6 mois d'attente", 'New tax stamps + 6 months waiting')}</div>
              </div>
              <div className="flex-1 bg-white p-6 rounded-xl shadow-sm border border-[#d1fae5]">
                <div className="font-semibold text-[#2d6a4f] mb-4">{tr('✓ Accès Complet', '✓ Full Access')}</div>
                <div className="text-[2rem] font-bold text-[#2d6a4f] mb-2">20€</div>
                <div className="text-sm text-gray-600">{tr('Accès illimité • Garantie réussite', 'Unlimited access • Success guarantee')}</div>
              </div>
            </div>
          </div>

          <div className="text-center mt-12 max-w-[800px] mx-auto">
            <button 
              className="btn btn-primary mb-4" 
              onClick={() => navigate(`/checkout?plan=${encodeURIComponent(selectedTitle)}`)}
            >
              🔓 {tr('DÉBLOQUER MON ACCÈS - 20€', 'UNLOCK MY ACCESS - EUR 20')}
            </button>
            <p className="text-gray-600 text-[1rem]">{tr('✓ 200+ questions • 5 examens blancs • Fiches interactives', '✓ 200+ questions • 5 mock exams • Interactive cards')}<br/>{tr('✓ Garantie satisfait ou remboursé', '✓ Satisfaction or money-back guarantee')}</p>
          </div>
        </div>
      )}
    </>
  );
};

export default FreePage;

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Header from '../components/Header';
import { questionsByLevel } from '../data/questions';
import { plans, TitleType } from '../data/plans';

type ViewState = 'quiz' | 'results';
type LocalizedExplanation = { fr: string; en: string };

const detailedExplanations: Record<string, LocalizedExplanation> = {
  "Quelle est la durée du mandat présidentiel ?": {
    fr: "Le président de la République est élu pour 5 ans depuis le passage au quinquennat (réforme de 2000, appliquée en 2002). 4, 6 ou 7 ans ne correspondent plus au système actuel.",
    en: "The President of the Republic is elected for 5 years since the five-year term reform (2000, applied in 2002). 4, 6, or 7 years are no longer valid.",
  },
  "Combien de départements en France (total) ?": {
    fr: "La France compte 101 départements: 96 en métropole et 5 en outre-mer. Ce chiffre est une base classique de l'examen civique.",
    en: "France has 101 departments: 96 in mainland France and 5 overseas. This number is a standard civic exam reference.",
  },
  "Année création Sécurité Sociale ?": {
    fr: "La Sécurité sociale a été créée en 1945 après la Seconde Guerre mondiale pour protéger la population contre les risques de la vie (maladie, retraite, etc.).",
    en: "Social Security was created in 1945 after World War II to protect people against major life risks (health, retirement, etc.).",
  },
  "Qui vote aux élections municipales ?": {
    fr: "Aux municipales, votent les citoyens français et les citoyens de l'Union européenne résidant en France, sous conditions d'inscription. Tous les résidents étrangers ne votent pas.",
    en: "In municipal elections, French citizens and EU citizens residing in France can vote if registered. Not all foreign residents can vote.",
  },
  "Devise de la République française ?": {
    fr: "La devise officielle est « Liberté, Égalité, Fraternité ». Elle est issue de l'histoire républicaine et figure sur de nombreux bâtiments publics.",
    en: "The official motto is 'Liberty, Equality, Fraternity.' It comes from republican history and appears on many public buildings.",
  },
  "Qu'est-ce que la laïcité ?": {
    fr: "La laïcité signifie la neutralité de l'État vis-à-vis des religions et la liberté de croire ou non. Elle n'interdit pas la religion, elle encadre la séparation entre sphère publique et religieuse.",
    en: "Secularism means state neutrality toward religions and freedom to believe or not. It does not ban religion; it separates public institutions and religion.",
  },
  "Loi séparation Église-État ?": {
    fr: "La grande loi de séparation des Églises et de l'État date de 1905. C'est un repère essentiel pour comprendre la laïcité en France.",
    en: "The key law separating Church and State dates from 1905. It is a core reference for understanding French secularism.",
  },
  "Qui a instauré le Code Civil ?": {
    fr: "Le Code civil de 1804 est associé à Napoléon Bonaparte. Il a structuré durablement le droit civil français.",
    en: "The Civil Code of 1804 is associated with Napoleon Bonaparte. It shaped French civil law for the long term.",
  },
  "Qui a instauré Ve République ?": {
    fr: "La Ve République a été mise en place en 1958 sous l'impulsion du général de Gaulle. C'est encore le régime institutionnel actuel.",
    en: "The Fifth Republic was established in 1958 under General de Gaulle. It is still France's current institutional system.",
  },
  "Traité Maastricht (UE) ?": {
    fr: "Le traité de Maastricht date de 1992. Il marque une étape majeure de la construction européenne et la naissance de l'Union européenne.",
    en: "The Maastricht Treaty was signed in 1992. It was a major milestone in European integration and the creation of the EU.",
  },
  "Rôle Conseil constitutionnel ?": {
    fr: "Le Conseil constitutionnel vérifie que les lois respectent la Constitution. Il ne vote pas les lois et n'élit pas le président.",
    en: "The Constitutional Council checks whether laws comply with the Constitution. It does not vote laws or elect the president.",
  },
  "Appel 18 juin 1940 ?": {
    fr: "L'appel du 18 juin 1940 est celui du général de Gaulle depuis Londres. C'est un symbole fondateur de la Résistance française.",
    en: "The June 18, 1940 appeal was made by General de Gaulle from London. It is a founding symbol of the French Resistance.",
  },
  "Droit du sol ?": {
    fr: "En France, le droit du sol existe mais sous conditions juridiques précises. Ce n'est ni automatique dans tous les cas, ni inexistant.",
    en: "In France, birthright citizenship exists but under specific legal conditions. It is neither always automatic nor nonexistent.",
  },
  "Qui a écrit les Misérables ?": {
    fr: "Victor Hugo est l'auteur des Misérables, œuvre majeure de la littérature française du XIXe siècle.",
    en: "Victor Hugo wrote Les Misérables, a major work of 19th-century French literature.",
  },
  "Guerre d'Algérie (fin) ?": {
    fr: "La guerre d'Algérie se termine en 1962, notamment avec les accords d'Évian. C'est une date historique très importante.",
    en: "The Algerian War ended in 1962, notably with the Evian Accords. This is a key historical date.",
  },
  "Sommet de l'Europe (montagne) ?": {
    fr: "Le Mont Blanc est le plus haut sommet d'Europe occidentale, situé dans les Alpes. C'est un repère géographique classique.",
    en: "Mont Blanc is the highest peak in Western Europe, located in the Alps. It is a classic geography reference.",
  },
  "Peintre impressionniste ?": {
    fr: "Claude Monet est une figure majeure de l'impressionnisme français. Picasso et Dali appartiennent à d'autres mouvements.",
    en: "Claude Monet is a major figure of French Impressionism. Picasso and Dali belong to different movements.",
  },
  "Abolition peine de mort ?": {
    fr: "La peine de mort a été abolie en France en 1981, sous l'impulsion de Robert Badinter. C'est un repère civique central.",
    en: "The death penalty was abolished in France in 1981, notably through Robert Badinter's action. It is a key civic reference.",
  },
  "Devise de l'UE ?": {
    fr: "La devise de l'Union européenne est « Unie dans la diversité ». Elle exprime l'unité des États membres malgré leurs différences.",
    en: "The EU motto is 'United in diversity.' It expresses unity among member states despite their differences.",
  },
  "Droit de grève (année) ?": {
    fr: "Le droit de grève est reconnu en France dès 1864 (loi Ollivier), puis consolidé ensuite. C'est un point historique du droit social.",
    en: "The right to strike was recognized in France in 1864 (Ollivier law), then reinforced later. It is a core social-rights milestone.",
  },
};

const FreePage: React.FC = () => {
  const navigate = useNavigate();
  const { i18n } = useTranslation();
  const tr = (fr: string, en: string) => (i18n.resolvedLanguage === 'en' ? en : fr);
  const [view, setView] = useState<ViewState>('quiz');
  const [selectedTitle, setSelectedTitle] = useState<TitleType>('CSP');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<number[]>([]);
  const [quizScore, setQuizScore] = useState(0);
  const currentQuestion = questionsByLevel[selectedTitle][currentQuestionIndex];
  const selectedAnswerIndex = userAnswers[currentQuestionIndex];
  const hasAnsweredCurrent = selectedAnswerIndex !== undefined;
  const isCurrentCorrect = hasAnsweredCurrent && selectedAnswerIndex === currentQuestion?.correct;

  const getAnswerExplanation = (theme?: string, correctAnswer?: string) => {
    if (!theme || !correctAnswer) return '';
    if (currentQuestion?.q && detailedExplanations[currentQuestion.q]) {
      return tr(detailedExplanations[currentQuestion.q].fr, detailedExplanations[currentQuestion.q].en);
    }

    if (theme === 'Institutions') {
      return tr(
        `Thème institutions: "${correctAnswer}" est la bonne réponse car elle correspond au fonctionnement officiel de l'État français (Constitution, institutions, élections).`,
        `Institutions topic: "${correctAnswer}" is correct because it matches France's official institutional framework (Constitution, institutions, elections).`,
      );
    }

    if (theme === 'Histoire') {
      return tr(
        `Thème histoire: la bonne réponse est "${correctAnswer}" car c'est le repère historique attendu à l'examen.`,
        `History topic: "${correctAnswer}" is correct because it is the historical reference expected in the exam.`,
      );
    }

    if (theme === 'Géographie') {
      return tr(
        `Thème géographie: la bonne réponse est "${correctAnswer}" car elle correspond à la réalité territoriale de la France.`,
        `Geography topic: "${correctAnswer}" is correct because it matches France's territorial reality.`,
      );
    }

    if (theme === 'Droits') {
      return tr(
        `Thème droits: la bonne réponse est "${correctAnswer}" car elle respecte le cadre légal et citoyen français.`,
        `Rights topic: "${correctAnswer}" is correct because it follows the French legal and civic framework.`,
      );
    }

    if (theme === 'Valeurs') {
      return tr(
        `Thème valeurs: la bonne réponse est "${correctAnswer}" car elle reflète les principes de la République française.`,
        `Values topic: "${correctAnswer}" is correct because it reflects the principles of the French Republic.`,
      );
    }

    return tr(
      `La bonne réponse est "${correctAnswer}".`,
      `The correct answer is "${correctAnswer}".`,
    );
  };

  const handleAnswerSelect = (answerIndex: number) => {
    if (userAnswers[currentQuestionIndex] !== undefined) return;
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
                className="h-full bg-gradient-to-r from-[#d72638] to-[#ef4444] rounded-full transition-all duration-400"
                style={{ width: `${((currentQuestionIndex) / 10) * 100}%` }}
              ></div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 sm:p-10 shadow-[0_8px_24px_rgba(0,0,0,0.08)] mb-8">
            <div className="font-heading text-[#d72638] font-bold text-base sm:text-lg mb-4 uppercase tracking-wider">
              {tr('Question', 'Question')} {currentQuestionIndex + 1}/10
            </div>
            <div className="font-heading text-2xl sm:text-2xl sm:text-4xl font-bold text-[#1a1a1a] mb-8 leading-tight">
              {currentQuestion?.q}
            </div>
            <div className="grid gap-4">
              {currentQuestion?.answers?.map((answer, idx) => (
                <div 
                  key={idx}
                  className={`p-4 sm:p-6 border-2 rounded-xl transition-all text-base sm:text-lg font-medium flex items-center
                    ${
                      hasAnsweredCurrent
                        ? idx === currentQuestion.correct
                          ? 'border-[#1a4d8f] bg-[#eef4ff] text-[#0f3466] shadow-md'
                          : idx === selectedAnswerIndex
                            ? 'border-[#d32f2f] bg-[#fff1f2] text-[#7f1d1d] shadow-md'
                            : 'border-[#e2e8f0] bg-[#f8fafc] text-[#64748b]'
                        : userAnswers[currentQuestionIndex] === idx
                          ? 'border-[#1a4d8f] bg-[#f0f9ff] text-[#1a4d8f] shadow-md transform -translate-y-1 cursor-pointer'
                          : 'border-[#e2e8f0] hover:border-[#cbd5e1] hover:bg-[#f8fafc] cursor-pointer'
                    }`}
                  onClick={() => handleAnswerSelect(idx)}
                >
                  <div className={`w-6 h-6 rounded-full border-2 mr-4 flex items-center justify-center
                    ${
                      hasAnsweredCurrent
                        ? idx === currentQuestion.correct
                          ? 'border-[#1a4d8f]'
                          : idx === selectedAnswerIndex
                            ? 'border-[#d32f2f]'
                            : 'border-[#cbd5e1]'
                        : userAnswers[currentQuestionIndex] === idx
                          ? 'border-[#1a4d8f]'
                          : 'border-[#cbd5e1]'
                    }`}
                  >
                    {hasAnsweredCurrent && idx === currentQuestion.correct && <div className="w-3 h-3 bg-[#1a4d8f] rounded-full"></div>}
                    {hasAnsweredCurrent && idx !== currentQuestion.correct && idx === selectedAnswerIndex && <div className="w-3 h-3 bg-[#d32f2f] rounded-full"></div>}
                    {!hasAnsweredCurrent && userAnswers[currentQuestionIndex] === idx && <div className="w-3 h-3 bg-[#1a4d8f] rounded-full"></div>}
                  </div>
                  {answer}
                </div>
              ))}
            </div>

            {hasAnsweredCurrent && currentQuestion && (
              <div
                className={`mt-6 rounded-xl border px-4 py-4 sm:px-5 sm:py-5 ${
                  isCurrentCorrect ? 'border-[#bfdbfe] bg-[#eef4ff]' : 'border-[#fecdd3] bg-[#fff1f2]'
                }`}
              >
                <div className={`font-heading text-xl font-bold ${isCurrentCorrect ? 'text-[#0f3466]' : 'text-[#b91c1c]'}`}>
                  {isCurrentCorrect
                    ? tr('✅ Bonne réponse', '✅ Correct answer')
                    : tr('❌ Mauvaise réponse', '❌ Wrong answer')}
                </div>
                <p className="mt-2 text-sm sm:text-base text-[#334155]">
                  {tr('Bonne réponse:', 'Correct answer:')} <strong>{currentQuestion.answers[currentQuestion.correct]}</strong>
                </p>
                <p className="mt-2 text-sm sm:text-base text-[#475569]">
                  {getAnswerExplanation(currentQuestion.theme, currentQuestion.answers[currentQuestion.correct])}
                </p>
                <p className="mt-2 text-xs sm:text-sm text-[#64748b]">
                  {tr(`Thème: ${currentQuestion.theme}`, `Topic: ${currentQuestion.theme}`)}
                </p>
              </div>
            )}
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
          <div className="bg-white rounded-2xl p-5 sm:p-8 lg:p-12 shadow-[0_8px_24px_rgba(0,0,0,0.08)] text-center max-w-[800px] mx-auto mb-8">
            <h2 className="font-heading text-3xl sm:text-2xl sm:text-4xl text-gray-600">{tr('Votre score', 'Your score')}</h2>
            <div className="font-heading text-5xl sm:text-7xl font-extrabold text-[#1a4d8f] my-4">{quizScore}/10</div>
            <div className={`font-bold text-xl uppercase tracking-wider mb-6 ${
              quizScore >= 8 ? 'text-[#1a4d8f]' : quizScore >= 5 ? 'text-[#0f3466]' : 'text-[#d32f2f]'
            }`}>
              {quizScore >= 8 ? tr('✅ BON NIVEAU', '✅ GOOD LEVEL') : quizScore >= 5 ? tr('⚠️ NIVEAU MOYEN', '⚠️ MEDIUM LEVEL') : tr('⚠️ NIVEAU INSUFFISANT', '⚠️ INSUFFICIENT LEVEL')}
            </div>
            <p className="mt-6 text-base sm:text-lg text-gray-600">{tr("Score minimum requis à l'examen officiel :", 'Minimum score required in official exam:')} <strong>32/40 (80%)</strong></p>
          </div>

          <div className="bg-gradient-to-br from-[#f0f9ff] to-[#e0f2fe] border-l-4 border-[#1a4d8f] rounded-xl p-5 sm:p-8 my-8 max-w-[800px] mx-auto">
            <h4 className="font-heading text-[#1a4d8f] text-2xl sm:text-[1.5rem] mb-4">💡 {tr('Vous voulez vraiment réussir ?', 'Do you really want to succeed?')}</h4>
            <p className="text-base sm:text-base sm:text-lg leading-relaxed mb-6">{tr("Débloquez l'accès complet avec 200+ questions de révision, 5 examens blancs et des fiches interactives.", 'Unlock full access with 200+ review questions, 5 mock exams and interactive cards.')}</p>
            <div className="flex gap-4 flex-wrap">
              <div className="flex-1 bg-white p-6 rounded-xl shadow-sm border border-[#fee2e2]">
                <div className="font-semibold text-[#d32f2f] mb-4">{tr("En cas d'échec", 'In case of failure')}</div>
                <div className="text-2xl sm:text-4xl font-bold text-[#d32f2f] mb-2">225€+</div>
                <div className="text-sm text-gray-600">{tr("Nouveaux timbres fiscaux + 6 mois d'attente", 'New tax stamps + 6 months waiting')}</div>
              </div>
              <div className="flex-1 bg-white p-6 rounded-xl shadow-sm border border-[#dbeafe]">
                <div className="font-semibold text-[#1a4d8f] mb-4">{tr('✓ Accès Complet', '✓ Full Access')}</div>
                <div className="text-2xl sm:text-4xl font-bold text-[#1a4d8f] mb-2">20€</div>
                <div className="text-sm text-gray-600">{tr('Accès illimité • Garantie réussite', 'Unlimited access • Success guarantee')}</div>
              </div>
            </div>
          </div>

          <div className="text-center mt-10 sm:mt-12 max-w-[800px] mx-auto">
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

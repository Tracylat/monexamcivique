import React, { useState, useEffect, useRef } from 'react';
import Header from '../components/Header';
import { questionsByLevel, sampleCards, encouragementMessages } from '../data/questions';

type ViewState = 'selection' | 'quiz' | 'results' | 'dashboard' | 'flashcards' | 'exam' | 'examResults' | 'certificate' | 'statistics';
type TitleType = 'CSP' | 'Résident' | 'Naturalisation';

const AppPage: React.FC = () => {
  const [view, setView] = useState<ViewState>('dashboard');
  const [selectedTitle, setSelectedTitle] = useState<TitleType>('CSP');
  
  // Quiz State
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<number[]>([]);
  const [quizScore, setQuizScore] = useState(0);

  // Dashboard State
  const [masteredCardsCount, setMasteredCardsCount] = useState(0);
  const [examsPassedCount, setExamsPassedCount] = useState(0);
  const [isPremium, setIsPremium] = useState(false);

  // Flashcards State
  const [currentFlashcardIndex, setCurrentFlashcardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [flashcards, setFlashcards] = useState<any[]>([]);

  // Exam State
  const [examQuestions, setExamQuestions] = useState<any[]>([]);
  const [examCurrentQuestionIndex, setExamCurrentQuestionIndex] = useState(0);
  const [examAnswers, setExamAnswers] = useState<number[]>([]);
  const [examTimeRemaining, setExamTimeRemaining] = useState(45 * 60);
  const [examScore, setExamScore] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Encouragement
  const [encouragement, setEncouragement] = useState<{text: string, subtext: string} | null>(null);
  const shownEncouragements = useRef<string[]>([]);

  useEffect(() => {
    // Initialize flashcards
    const cards = [];
    for(let i=0; i<10; i++) cards.push(...sampleCards);
    setFlashcards(cards);
  }, []);

  const startQuiz = (title: TitleType) => {
    setSelectedTitle(title);
    setCurrentQuestionIndex(0);
    setUserAnswers([]);
    setView('quiz');
  };

  const handleAnswerSelect = (answerIndex: number) => {
    const newAnswers = [...userAnswers];
    newAnswers[currentQuestionIndex] = answerIndex;
    setUserAnswers(newAnswers);
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < questionsByLevel[selectedTitle].length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      calculateScore();
    }
  };

  const calculateScore = () => {
    let score = 0;
    const questions = questionsByLevel[selectedTitle];
    userAnswers.forEach((ans, idx) => {
      if (ans === questions[idx].correct) score++;
    });
    setQuizScore(score);
    setView('results');
  };

  const unlockPremium = () => {
    alert('🎉 Paiement simulé avec succès !\n\nVotre accès premium est activé.');
    setIsPremium(true);
    setView('dashboard');
  };

  // Flashcard Logic
  const handleCardMastered = () => {
    setMasteredCardsCount(prev => {
      const newVal = prev + 1;
      checkEncouragement(newVal);
      return newVal;
    });
    nextFlashcard();
  };

  const handleCardNotMastered = () => {
    nextFlashcard();
  };

  const nextFlashcard = () => {
    setIsFlipped(false);
    setCurrentFlashcardIndex(prev => (prev + 1) % flashcards.length);
  };

  const checkEncouragement = (count: number) => {
    let trigger = '';
    if (count === 10) trigger = 'cards-10';
    if (count === 25) trigger = 'cards-25';
    if (count === 50) trigger = 'cards-50';
    if (count === 75) trigger = 'cards-75';
    if (count === 100) trigger = 'cards-100';

    if (trigger && !shownEncouragements.current.includes(trigger)) {
      const msg = encouragementMessages.find(m => m.trigger === trigger);
      if (msg) {
        setEncouragement(msg);
        shownEncouragements.current.push(trigger);
        setTimeout(() => setEncouragement(null), 5000);
      }
    }
  };

  // Exam Logic
  const startExam = () => {
    const allQuestions = [...questionsByLevel.CSP, ...questionsByLevel.Résident, ...questionsByLevel.Naturalisation];
    // Shuffle and pick 40
    const shuffled = allQuestions.sort(() => 0.5 - Math.random()).slice(0, 40); // In real app, ensure 40 unique
    // Since we have limited questions in sample, we might duplicate or just take what we have.
    // For this demo, let's just take all available if < 40, or duplicate.
    // The sample data has 10 per level = 30 total. Let's just use 30 for now or duplicate.
    let examQs = [...shuffled];
    while(examQs.length < 40) {
        examQs = [...examQs, ...allQuestions].slice(0, 40);
    }
    
    setExamQuestions(examQs);
    setExamCurrentQuestionIndex(0);
    setExamAnswers([]);
    setExamTimeRemaining(45 * 60);
    setView('exam');
    
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setExamTimeRemaining(prev => {
        if (prev <= 1) {
          submitExam();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const submitExam = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    let score = 0;
    examAnswers.forEach((ans, idx) => {
      if (examQuestions[idx] && ans === examQuestions[idx].correct) score++;
    });
    setExamScore(score);
    if (score >= 32) {
        setExamsPassedCount(prev => prev + 1);
    }
    setView('examResults');
  };

  const handleExamAnswerSelect = (answerIndex: number) => {
    const newAnswers = [...examAnswers];
    newAnswers[examCurrentQuestionIndex] = answerIndex;
    setExamAnswers(newAnswers);
  };

  const nextExamQuestion = () => {
    if (examCurrentQuestionIndex < examQuestions.length - 1) {
      setExamCurrentQuestionIndex(examCurrentQuestionIndex + 1);
    } else {
      submitExam();
    }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <>
      <Header />
      
      {/* Encouragement Toast */}
      {encouragement && (
        <div className="fixed top-24 right-8 bg-white p-6 rounded-xl shadow-2xl z-50 animate-bounce border-l-4 border-[#2d6a4f] max-w-sm">
          <button onClick={() => setEncouragement(null)} className="absolute top-2 right-2 text-gray-400 hover:text-gray-600">×</button>
          <div className="text-3xl mb-2">🎉</div>
          <p className="font-bold text-lg mb-1">{encouragement.text}</p>
          <p className="text-sm text-gray-600">{encouragement.subtext}</p>
        </div>
      )}

      {/* SELECTION VIEW */}
      {view === 'selection' && (
        <div className="max-w-[1200px] mx-auto p-8">
          <div className="max-w-[900px] mx-auto py-16 px-8">
            <div className="text-center mb-12">
              <h2 className="font-heading text-[2.8rem] font-extrabold text-[#0f3466] mb-4">Quel titre de séjour demandez-vous ?</h2>
              <p className="text-[1.2rem] text-gray-600">Sélectionnez pour un test adapté à VOTRE niveau</p>
            </div>
            <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-8 mt-12">
              <div className="bg-white rounded-2xl p-10 shadow-[0_8px_24px_rgba(0,0,0,0.08)] transition-all cursor-pointer border-2 border-transparent hover:-translate-y-2 hover:shadow-[0_16px_40px_rgba(0,0,0,0.12)] hover:border-[#1a4d8f]" onClick={() => startQuiz('CSP')}>
                <div className="text-[3rem] text-center mb-4">📋</div>
                <div className="font-heading text-[1.8rem] font-bold text-[#1a4d8f] mb-2">Carte de Séjour Pluriannuelle</div>
                <p className="text-gray-600 mb-4">Durée : 2 à 4 ans</p>
                <div className="bg-[#e0f2fe] p-4 rounded-lg text-sm"><strong>Niveau :</strong> Questions standard</div>
              </div>
              <div className="bg-white rounded-2xl p-10 shadow-[0_8px_24px_rgba(0,0,0,0.08)] transition-all cursor-pointer border-2 border-transparent hover:-translate-y-2 hover:shadow-[0_16px_40px_rgba(0,0,0,0.12)] hover:border-[#1a4d8f]" onClick={() => startQuiz('Résident')}>
                <div className="text-[3rem] text-center mb-4">🏡</div>
                <div className="font-heading text-[1.8rem] font-bold text-[#1a4d8f] mb-2">Carte de Résident</div>
                <p className="text-gray-600 mb-4">Durée : 10 ans</p>
                <div className="bg-[#fef3c7] p-4 rounded-lg text-sm"><strong>Niveau :</strong> Questions avancées ⚠️</div>
              </div>
              <div className="bg-white rounded-2xl p-10 shadow-[0_8px_24px_rgba(0,0,0,0.08)] transition-all cursor-pointer border-2 border-transparent hover:-translate-y-2 hover:shadow-[0_16px_40px_rgba(0,0,0,0.12)] hover:border-[#1a4d8f]" onClick={() => startQuiz('Naturalisation')}>
                <div className="text-[3rem] text-center mb-4">🇫🇷</div>
                <div className="font-heading text-[1.8rem] font-bold text-[#1a4d8f] mb-2">Naturalisation</div>
                <p className="text-gray-600 mb-4">Citoyenneté française</p>
                <div className="bg-[#fee2e2] p-4 rounded-lg text-sm"><strong>Niveau :</strong> Questions expertes 🔥</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* QUIZ VIEW */}
      {view === 'quiz' && (
        <div className="max-w-[1200px] mx-auto p-8">
          <div className="bg-gradient-to-br from-[#1a4d8f] to-[#0f3466] text-white p-12 rounded-[20px] text-center mb-12">
            <h2 className="font-heading text-[2.8rem] font-extrabold mb-4">ÉVALUATION GRATUITE</h2>
            <p className="text-[1.3rem] mt-4">Testez vos chances de réussite</p>
            <div className="bg-[rgba(255,255,255,0.2)] rounded-full h-3 max-w-[500px] mx-auto mt-8 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-[#ff6b35] to-[#ff8f6b] rounded-full transition-all duration-400"
                style={{ width: `${((currentQuestionIndex) / questionsByLevel[selectedTitle].length) * 100}%` }}
              ></div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-12 shadow-[0_8px_24px_rgba(0,0,0,0.08)] mb-8">
            <div className="font-heading text-[#ff6b35] font-bold text-lg mb-4 uppercase tracking-wider">
              Question {currentQuestionIndex + 1}/{questionsByLevel[selectedTitle].length}
            </div>
            <div className="font-heading text-[2rem] font-bold text-[#1a1a1a] mb-8 leading-tight">
              {questionsByLevel[selectedTitle][currentQuestionIndex].q}
            </div>
            <div className="grid gap-4">
              {questionsByLevel[selectedTitle][currentQuestionIndex].answers.map((answer, idx) => (
                <div 
                  key={idx}
                  className={`p-6 border-2 rounded-xl cursor-pointer transition-all text-lg font-medium flex items-center
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
              {currentQuestionIndex < questionsByLevel[selectedTitle].length - 1 ? 'Question suivante' : 'Voir mes résultats'}
            </button>
          </div>
        </div>
      )}

      {/* RESULTS VIEW */}
      {view === 'results' && (
        <div className="max-w-[1200px] mx-auto p-8">
          <div className="bg-white rounded-2xl p-12 shadow-[0_8px_24px_rgba(0,0,0,0.08)] text-center max-w-[800px] mx-auto mb-8">
            <h2 className="font-heading text-[2rem] text-gray-600">Votre score</h2>
            <div className="font-heading text-[5rem] font-extrabold text-[#1a4d8f] my-4">{quizScore}/10</div>
            <div className={`font-bold text-xl uppercase tracking-wider mb-6 ${
              quizScore >= 8 ? 'text-[#2d6a4f]' : quizScore >= 5 ? 'text-[#f59e0b]' : 'text-[#d32f2f]'
            }`}>
              {quizScore >= 8 ? '✅ BON NIVEAU' : quizScore >= 5 ? '⚠️ NIVEAU MOYEN' : '⚠️ NIVEAU INSUFFISANT'}
            </div>
            <p className="mt-6 text-[1.1rem] text-gray-600">Score minimum requis : <strong>32/40 (80%)</strong> à l'examen officiel</p>
          </div>

          <div className="bg-[#fff5f5] border-l-4 border-[#d32f2f] p-8 rounded-r-lg max-w-[800px] mx-auto mb-12">
            <h3 className="text-[#d32f2f] font-bold text-xl mb-2">⚠️ Attention : Risque d'échec élevé</h3>
            <p className="text-[1.2rem] leading-relaxed">Avec ce score, votre examen en préfecture présente un <strong>risque d'échec très élevé</strong>. Conséquences : dossier bloqué, projet de vie retardé de 6+ mois.</p>
          </div>

          <div className="bg-gradient-to-br from-[#f0f9ff] to-[#e0f2fe] border-l-4 border-[#1a4d8f] rounded-xl p-8 my-8 max-w-[800px] mx-auto">
            <h4 className="font-heading text-[#1a4d8f] text-[1.5rem] mb-4">💡 Le saviez-vous ?</h4>
            <p className="text-[1.1rem] leading-relaxed mb-6">Un examen raté coûte 10x plus cher qu'une préparation sérieuse.</p>
            <div className="flex gap-4 flex-wrap">
              <div className="flex-1 bg-white p-6 rounded-xl shadow-sm border border-[#fee2e2]">
                <div className="font-semibold text-[#d32f2f] mb-4">En cas d'échec</div>
                <div className="text-[2rem] font-bold text-[#d32f2f] mb-2">225€+</div>
                <div className="text-sm text-gray-600">Nouveaux timbres fiscaux<br/>+ 6 mois d'attente minimum<br/>+ Dossier bloqué</div>
              </div>
              <div className="flex-1 bg-white p-6 rounded-xl shadow-sm border border-[#d1fae5]">
                <div className="font-semibold text-[#2d6a4f] mb-4">✓ Avec Examen Civique Etrangers</div>
                <div className="text-[2rem] font-bold text-[#2d6a4f] mb-2">20€</div>
                <div className="text-sm text-gray-600">Accès illimité 6 mois<br/>✓ 200+ questions réelles<br/>✓ Réussite garantie</div>
              </div>
            </div>
          </div>

          <div className="text-center mt-12">
            <button className="btn btn-primary" onClick={unlockPremium}>🔓 DÉBLOQUER MON ACCÈS RÉUSSITE - 20€</button>
            <p className="text-gray-600 mt-4 text-[1rem]">✓ Fiches révision interactives • Répétition espacée<br/>✓ Examens blancs 45min • Statistiques détaillées<br/>✓ Certificat de réussite PDF • Garantie satisfait ou remboursé</p>
          </div>
        </div>
      )}

      {/* DASHBOARD VIEW */}
      {view === 'dashboard' && (
        <div className="max-w-[1200px] mx-auto p-8">
          <div className="mb-8">
            <h2 className="font-heading text-[2.5rem] font-bold text-[#1a4d8f]">🎯 Votre parcours de réussite</h2>
            <p className="text-[1.2rem] opacity-95">Titre choisi : <span className="font-bold">{selectedTitle}</span></p>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-[0_4px_12px_rgba(0,0,0,0.05)] flex items-start gap-6 mb-6">
            <div className="text-[2.5rem] bg-[#e0f2fe] w-16 h-16 rounded-full flex items-center justify-center">📚</div>
            <div className="flex-1">
              <div className="font-heading text-[1.5rem] font-bold text-[#1a4d8f] mb-2">1. Fiches de révision par thème</div>
              <div className="text-gray-600 mb-4">🟢 Actif • <span className="font-bold">{masteredCardsCount}</span>/100 cartes maîtrisées</div>
              <div className="bg-gray-200 rounded-full h-2 w-full mb-4">
                <div className="bg-[#2d6a4f] h-2 rounded-full transition-all" style={{ width: `${(masteredCardsCount/100)*100}%` }}></div>
              </div>
              <button className="btn btn-primary text-sm py-3 px-6" onClick={() => setView('flashcards')}>Commencer les fiches</button>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-[0_4px_12px_rgba(0,0,0,0.05)] flex items-start gap-6 mb-6">
            <div className={`text-[2.5rem] w-16 h-16 rounded-full flex items-center justify-center ${masteredCardsCount >= 50 ? 'bg-[#e0f2fe]' : 'bg-gray-100 grayscale opacity-50'}`}>✍️</div>
            <div className="flex-1">
              <div className="font-heading text-[1.5rem] font-bold text-[#1a4d8f] mb-2">2. Examens blancs (40 questions)</div>
              <div className="text-gray-600 mb-4">
                {masteredCardsCount >= 50 ? `🟢 Actif • ${examsPassedCount}/3 examens réussis` : '🔒 Débloqué après 50 fiches maîtrisées'}
              </div>
              <div className="bg-gray-200 rounded-full h-2 w-full mb-4">
                <div className="bg-[#2d6a4f] h-2 rounded-full transition-all" style={{ width: `${(examsPassedCount/3)*100}%` }}></div>
              </div>
              <button 
                className={`btn text-sm py-3 px-6 ${masteredCardsCount >= 50 ? 'btn-primary' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
                disabled={masteredCardsCount < 50}
                onClick={startExam}
              >
                {masteredCardsCount >= 50 ? 'Commencer un examen blanc' : '🔒 Verrouillé'}
              </button>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-[0_4px_12px_rgba(0,0,0,0.05)] flex items-start gap-6 mb-6">
            <div className={`text-[2.5rem] w-16 h-16 rounded-full flex items-center justify-center ${examsPassedCount >= 3 ? 'bg-[#e0f2fe]' : 'bg-gray-100 grayscale opacity-50'}`}>🏆</div>
            <div className="flex-1">
              <div className="font-heading text-[1.5rem] font-bold text-[#1a4d8f] mb-2">3. Certificat de réussite</div>
              <div className="text-gray-600 mb-4">
                {examsPassedCount >= 3 ? '🟢 Disponible' : '🔒 Débloqué après 3 examens blancs réussis'}
              </div>
              <button 
                className={`btn text-sm py-3 px-6 ${examsPassedCount >= 3 ? 'btn-primary' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
                disabled={examsPassedCount < 3}
                onClick={() => setView('certificate')}
              >
                {examsPassedCount >= 3 ? 'Voir mon certificat' : '🔒 Verrouillé'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FLASHCARDS VIEW */}
      {view === 'flashcards' && (
        <div className="max-w-[1200px] mx-auto p-8">
          <div className="max-w-[800px] mx-auto">
            <div className="bg-gradient-to-br from-[#1a4d8f] to-[#0f3466] text-white p-8 rounded-[20px] mb-12 text-center">
              <h2 className="font-heading text-[2.5rem] font-extrabold mb-4">📚 Fiches de révision</h2>
              <p className="text-[1.2rem] opacity-95">Thème : <span className="font-bold">{flashcards[currentFlashcardIndex]?.theme}</span></p>
              <div className="mt-6 text-[1.1rem]">Carte <span className="font-bold">{currentFlashcardIndex + 1}</span>/100 • Maîtrisées : <span className="font-bold">{masteredCardsCount}</span></div>
            </div>

            <div 
              className="bg-white rounded-2xl p-0 shadow-[0_8px_24px_rgba(0,0,0,0.08)] min-h-[400px] cursor-pointer relative"
              onClick={() => setIsFlipped(!isFlipped)}
              style={{ 
                perspective: '1000px',
                transformStyle: 'preserve-3d',
                transition: 'transform 0.6s',
                transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)'
              }}
            >
              {/* Front */}
              <div 
                className="w-full h-full p-12 flex flex-col justify-center items-center rounded-2xl"
                style={{ 
                  backfaceVisibility: 'hidden',
                  WebkitBackfaceVisibility: 'hidden'
                }}
              >
                <div className="font-heading text-[2rem] font-bold text-[#1a1a1a] text-center">
                  {flashcards[currentFlashcardIndex]?.question}
                </div>
                <p className="text-center text-gray-600 mt-8 text-[0.95rem]">👆 Cliquez pour voir la réponse</p>
              </div>

              {/* Back */}
              <div 
                className="absolute w-full h-full p-12 flex flex-col justify-center items-center bg-[#f0f9ff] rounded-2xl top-0 left-0"
                style={{ 
                  backfaceVisibility: 'hidden',
                  WebkitBackfaceVisibility: 'hidden',
                  transform: 'rotateY(180deg)',
                  transformStyle: 'preserve-3d'
                }}
              >
                <div className="font-heading text-[2rem] font-bold text-[#1a4d8f] text-center mb-4">
                  {flashcards[currentFlashcardIndex]?.answer}
                </div>
                <div className="text-center text-gray-700 text-lg">
                  {flashcards[currentFlashcardIndex]?.explanation}
                </div>
              </div>
            </div>

            <div className="flex justify-center gap-4 mt-8">
              <button className="btn bg-[#d32f2f] text-white hover:bg-[#b71c1c]" onClick={handleCardNotMastered}>❌ Je ne savais pas</button>
              <button className="btn bg-[#2d6a4f] text-white hover:bg-[#1b4332]" onClick={handleCardMastered}>✅ Je savais</button>
            </div>

            <div className="text-center mt-8">
              <button className="btn bg-gray-600 text-white" onClick={() => setView('dashboard')}>← Retour au tableau de bord</button>
            </div>
          </div>
        </div>
      )}

      {/* EXAM VIEW */}
      {view === 'exam' && (
        <div className="max-w-[1200px] mx-auto p-8">
          <div className="bg-gradient-to-br from-[#1a4d8f] to-[#0f3466] text-white p-8 rounded-[20px] mb-8 flex justify-between items-center">
            <div>
              <h2 className="font-heading text-[2rem] font-bold">EXAMEN BLANC</h2>
              <p className="text-lg mt-2">Format officiel : 40 questions • 45 minutes</p>
            </div>
            <div className={`text-[2.5rem] font-mono font-bold bg-white/20 px-6 py-2 rounded-lg ${examTimeRemaining < 300 ? 'text-[#ff6b35]' : ''}`}>
              {formatTime(examTimeRemaining)}
            </div>
          </div>

          <div className="bg-white rounded-2xl p-12 shadow-[0_8px_24px_rgba(0,0,0,0.08)] mb-8">
            <div className="font-heading text-[#ff6b35] font-bold text-lg mb-4 uppercase tracking-wider">
              Question {examCurrentQuestionIndex + 1}/40
            </div>
            <div className="font-heading text-[2rem] font-bold text-[#1a1a1a] mb-8 leading-tight">
              {examQuestions[examCurrentQuestionIndex]?.q}
            </div>
            <div className="grid gap-4">
              {examQuestions[examCurrentQuestionIndex]?.answers.map((answer: string, idx: number) => (
                <div 
                  key={idx}
                  className={`p-6 border-2 rounded-xl cursor-pointer transition-all text-lg font-medium flex items-center
                    ${examAnswers[examCurrentQuestionIndex] === idx 
                      ? 'border-[#1a4d8f] bg-[#f0f9ff] text-[#1a4d8f] shadow-md transform -translate-y-1' 
                      : 'border-[#e2e8f0] hover:border-[#cbd5e1] hover:bg-[#f8fafc]'
                    }`}
                  onClick={() => handleExamAnswerSelect(idx)}
                >
                  <div className={`w-6 h-6 rounded-full border-2 mr-4 flex items-center justify-center
                    ${examAnswers[examCurrentQuestionIndex] === idx ? 'border-[#1a4d8f]' : 'border-[#cbd5e1]'}`}>
                    {examAnswers[examCurrentQuestionIndex] === idx && <div className="w-3 h-3 bg-[#1a4d8f] rounded-full"></div>}
                  </div>
                  {answer}
                </div>
              ))}
            </div>
          </div>

          <div className="text-center mt-8">
            <button 
              className="btn btn-primary" 
              onClick={nextExamQuestion}
              disabled={examAnswers[examCurrentQuestionIndex] === undefined}
            >
              {examCurrentQuestionIndex < 39 ? 'Question suivante' : 'Terminer l\'examen'}
            </button>
          </div>
        </div>
      )}

      {/* EXAM RESULTS VIEW */}
      {view === 'examResults' && (
        <div className="max-w-[1200px] mx-auto p-8">
          <div className="bg-white rounded-2xl p-12 shadow-[0_8px_24px_rgba(0,0,0,0.08)] text-center max-w-[800px] mx-auto mb-8">
            <h2 className="font-heading text-[2rem] text-gray-600">Résultat de l'examen blanc</h2>
            <div className="font-heading text-[5rem] font-extrabold text-[#1a4d8f] my-4">{examScore}/40</div>
            <div className={`font-bold text-xl uppercase tracking-wider mb-6 ${examScore >= 32 ? 'text-[#2d6a4f]' : 'text-[#d32f2f]'}`}>
              {examScore >= 32 ? '✅ RÉUSSI' : '❌ ÉCHOUÉ'}
            </div>
            <p className="mt-6 text-[1.1rem] text-gray-600">Temps écoulé : <strong>{formatTime((45*60) - examTimeRemaining)}</strong></p>
          </div>

          <div className="text-center mt-8">
            <button className="btn btn-primary" onClick={() => setView('dashboard')}>Retour au tableau de bord</button>
          </div>
        </div>
      )}

      {/* CERTIFICATE VIEW */}
      {view === 'certificate' && (
        <div className="max-w-[1200px] mx-auto p-8">
          <div className="bg-white p-16 rounded-2xl shadow-xl border-[10px] border-[#1a4d8f] text-center max-w-[900px] mx-auto relative overflow-hidden">
            <div className="absolute top-0 left-0 w-32 h-32 bg-[#1a4d8f] transform -translate-x-16 -translate-y-16 rotate-45"></div>
            <div className="absolute bottom-0 right-0 w-32 h-32 bg-[#1a4d8f] transform translate-x-16 translate-y-16 rotate-45"></div>
            
            <div className="text-[4rem] mb-4">🏆</div>
            <h1 className="font-heading text-[3.5rem] font-bold text-[#1a4d8f] mb-2 tracking-widest">CERTIFICAT</h1>
            <h2 className="font-heading text-[2rem] font-bold text-[#ff6b35] mb-8 uppercase tracking-widest">De Réussite</h2>
            
            <p className="text-[1.3rem] text-gray-600 mb-8">Ce certificat atteste que</p>
            <div className="font-heading text-[3rem] font-bold text-[#1a1a1a] mb-8 border-b-2 border-gray-200 inline-block px-12 pb-2">
              [Votre Nom]
            </div>
            
            <p className="text-[1.2rem] text-gray-600 leading-relaxed mb-8">
              a complété avec succès la formation de préparation à l'examen civique<br/>
              pour l'obtention de <strong>la {selectedTitle === 'CSP' ? 'Carte de Séjour Pluriannuelle' : selectedTitle === 'Résident' ? 'Carte de Résident' : 'Naturalisation'}</strong>
            </p>
            
            <div className="flex justify-center gap-12 mb-8">
              <div className="text-center">
                <div className="font-bold text-[#1a4d8f] text-xl">3</div>
                <div className="text-sm text-gray-500 uppercase">Examens réussis</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-[#1a4d8f] text-xl">100%</div>
                <div className="text-sm text-gray-500 uppercase">Fiches maîtrisées</div>
              </div>
            </div>

            <p className="text-[1rem] text-gray-500">Délivré le {new Date().toLocaleDateString()} par Examen Civique Etrangers</p>
          </div>

          <div className="text-center mt-8">
            <button className="btn btn-primary" onClick={() => window.print()}>📥 Télécharger le certificat PDF</button>
            <button className="btn bg-gray-600 text-white ml-4" onClick={() => setView('dashboard')}>Retour au tableau de bord</button>
          </div>
        </div>
      )}
    </>
  );
};

export default AppPage;

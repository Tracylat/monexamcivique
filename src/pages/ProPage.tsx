import React, { useState } from "react";
import { Link } from "react-router-dom";
import { quizData, Question } from "../data/quizData";

type ViewState = "selector" | "dashboard" | "quiz" | "summary";

type TitleKey = "CSP" | "CR" | "NAT";

const ProPage: React.FC = () => {
  const [view, setView] = useState<ViewState>("selector");
  const [currentTitle, setCurrentTitle] = useState<TitleKey | null>(null);
  const [currentTheme, setCurrentTheme] = useState<string>("");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [feedback, setFeedback] = useState<{ isCorrect: boolean; text: string } | null>(null);
  const [answers, setAnswers] = useState<number[]>([]);

  const [stats, setStats] = useState<Record<TitleKey, { correct: number; total: number }>>({
    CSP: { correct: 0, total: 0 },
    CR: { correct: 0, total: 0 },
    NAT: { correct: 0, total: 0 }
  });

  const selectTitle = (title: TitleKey) => {
    setCurrentTitle(title);
    setView("dashboard");
  };

  const selectTheme = (theme: string) => {
    if (!currentTitle) return;

    const themeQuestions = quizData[currentTitle]?.[theme] || [];

    setCurrentTheme(theme);
    setQuestions(themeQuestions);
    setCurrentQuestionIndex(0);
    setScore(0);
    setFeedback(null);
    setAnswers([]);
    setView("quiz");
  };

  const handleAnswer = (optionIndex: number) => {
    if (!currentTitle || feedback) return;

    const currentQ = questions[currentQuestionIndex];
    const isCorrect = optionIndex === currentQ.ok;

    setScore(prev => (isCorrect ? prev + 1 : prev));
    setFeedback({
      isCorrect,
      text: currentQ.expl
    });

    setAnswers(prev => [...prev, optionIndex]);

    setStats(prev => ({
      ...prev,
      [currentTitle]: {
        correct: prev[currentTitle].correct + (isCorrect ? 1 : 0),
        total: prev[currentTitle].total + 1
      }
    }));
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setFeedback(null);
    } else {
      setView("summary");
    }
  };

  const getProgress = (title: TitleKey) => {
    const s = stats[title];
    if (s.total === 0) return 0;
    return Math.round((s.correct / s.total) * 100);
  };

  return (
    <div className="app-page">
      {/* TOPBAR */}
      <div className="topbar">
        <Link to="/" className="topbar-logo">
          Mon Examen Civique
        </Link>
        <div className="topbar-right">
          <div className="topbar-title">Espace Révision PRO</div>
          <Link to="/" className="topbar-back">← Retour au site</Link>
        </div>
      </div>

      <div className="app-container">

        {/* SELECTOR */}
        {view === "selector" && (
          <div className="title-selector">
            <h1>Version PRO</h1>
            <p>Accédez à tous les titres premium.</p>

            {(["CSP", "CR", "NAT"] as TitleKey[]).map(title => (
              <button key={title} onClick={() => selectTitle(title)}>
                {title} — Progression {getProgress(title)}%
              </button>
            ))}
          </div>
        )}

        {/* DASHBOARD */}
        {view === "dashboard" && currentTitle && (
          <div>
            <h2>{currentTitle}</h2>

            {Object.keys(quizData[currentTitle] || {}).map(theme => (
              <button key={theme} onClick={() => selectTheme(theme)}>
                {theme}
              </button>
            ))}

            <button onClick={() => setView("selector")}>
              ← Changer de titre
            </button>
          </div>
        )}

        {/* QUIZ */}
        {view === "quiz" && questions.length > 0 && (
          <div>
            <h3>{currentTheme}</h3>

            <p>
              Question {currentQuestionIndex + 1}/{questions.length}
            </p>

            <div
              dangerouslySetInnerHTML={{
                __html: questions[currentQuestionIndex].q
              }}
            />

            {questions[currentQuestionIndex].opts.map((opt, idx) => (
              <button
                key={idx}
                onClick={() => handleAnswer(idx)}
                disabled={!!feedback}
              >
                {opt}
              </button>
            ))}

            {feedback && (
              <>
                <div>
                  {feedback.isCorrect ? "Bonne réponse !" : "Mauvaise réponse"}
                </div>
                <div dangerouslySetInnerHTML={{ __html: feedback.text }} />
                <button onClick={nextQuestion}>
                  Question suivante →
                </button>
              </>
            )}
          </div>
        )}

        {/* SUMMARY */}
        {view === "summary" && (
          <div>
            <h2>Résultat final</h2>
            <p>
              {score}/{questions.length}
            </p>

            <button onClick={() => setView("dashboard")}>
              Retour au tableau
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

export default ProPage;
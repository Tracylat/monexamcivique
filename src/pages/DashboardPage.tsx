import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

const DashboardPage: React.FC = () => {
  const { i18n } = useTranslation();
  const tr = (fr: string, en: string) => (i18n.resolvedLanguage === 'en' ? en : fr);
  const [user] = useState<{ email: string; role: string }>({
    email: 'utilisateur@local',
    role: tr('Utilisateur', 'User'),
  });
  const [quizzes, setQuizzes] = useState<any[]>([]);

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const apiBaseUrl = (import.meta.env.VITE_API_URL || 'http://localhost:5001').replace(/\/$/, '');
        const urls = [`${apiBaseUrl}/api/quiz`, `${apiBaseUrl}/quiz`];

        for (const url of urls) {
          const response = await fetch(url);
          if (response.status === 404) {
            continue;
          }
          if (!response.ok) {
            setQuizzes([]);
            return;
          }
          const data = await response.json();
          setQuizzes(data || []);
          return;
        }

        setQuizzes([]);
      } catch {
        setQuizzes([]);
      }
    };

    fetchQuizzes();
  }, []);

  return (
    <div style={{ padding: 32 }}>
      <h2>{tr('Bienvenue', 'Welcome')}, {user.email}</h2>
      <p>{tr('Profil', 'Profile')}: {user.role || tr('Utilisateur', 'User')}</p>
      <h3>{tr('Quiz disponibles', 'Available quizzes')}</h3>
      <ul>
        {quizzes.map(q => (
          <li key={q.id}>{q.title} - {q.description}</li>
        ))}
      </ul>
      {/* Ajoutez ici l'accès premium ou autres infos */}
    </div>
  );
};

export default DashboardPage;

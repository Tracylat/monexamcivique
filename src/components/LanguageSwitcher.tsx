import React from 'react';
import { useTranslation } from 'react-i18next';

const LanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation();
  const current = i18n.resolvedLanguage === 'en' ? 'en' : 'fr';
  const setLang = (lang: 'fr' | 'en') => i18n.changeLanguage(lang);

  return (
    <div
      className="inline-flex items-center gap-1 rounded-full border border-[#d7e3f4] bg-white/90 p-1 shadow-sm backdrop-blur"
      role="group"
      aria-label="Language selector"
    >
      <button
        type="button"
        onClick={() => setLang('fr')}
        className={`inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-xs sm:text-sm font-semibold transition ${
          current === 'fr' ? 'bg-[#1a4d8f] text-white' : 'text-[#1a4d8f] hover:bg-[#eef4fb]'
        }`}
      >
        🇫🇷 FR
      </button>
      <button
        type="button"
        onClick={() => setLang('en')}
        className={`inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-xs sm:text-sm font-semibold transition ${
          current === 'en' ? 'bg-[#1a4d8f] text-white' : 'text-[#1a4d8f] hover:bg-[#eef4fb]'
        }`}
      >
        🇬🇧 EN
      </button>
    </div>
  );
};

export default LanguageSwitcher;

import React from 'react';
import { useTranslation } from 'react-i18next';

const LanguageSwitcher: React.FC = () => {
  const { i18n, t } = useTranslation();
  const current = i18n.resolvedLanguage === 'en' ? 'en' : 'fr';

  return (
    <label className="bg-[#fafbfc] border-2 border-[#e2e8f0] py-2 px-3 rounded-lg flex gap-2 items-center font-semibold text-sm">
      <select
        value={current}
        onChange={(e) => i18n.changeLanguage(e.target.value)}
        className="bg-transparent outline-none cursor-pointer"
        aria-label="Language"
      >
        <option value="fr">🇫🇷 {t('language.fr')}</option>
        <option value="en">🇬🇧 {t('language.en')}</option>
      </select>
    </label>
  );
};

export default LanguageSwitcher;

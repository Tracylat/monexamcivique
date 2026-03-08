import React from 'react';
import { useTranslation } from 'react-i18next';

declare global {
  interface Window {
    google?: any;
    googleTranslateElementInitReact?: () => void;
  }
}

const LanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation();
  const current = (i18n.resolvedLanguage || 'fr').split('-')[0];
  const setLang = (lang: 'fr' | 'en' | 'es' | 'ar' | 'pt' | 'zh') => i18n.changeLanguage(lang);
  const languages = [
    { code: 'fr', label: '🇫🇷 Français' },
    { code: 'en', label: '🇬🇧 English' },
    { code: 'es', label: '🇪🇸 Español' },
    { code: 'ar', label: '🇸🇦 العربية' },
    { code: 'pt', label: '🇵🇹 Português' },
    { code: 'zh', label: '🇨🇳 中文' },
  ] as const;

  React.useEffect(() => {
    if (typeof window === 'undefined') return;
    if (document.getElementById('google_translate_element_react')) return;

    const holder = document.createElement('div');
    holder.id = 'google_translate_element_react';
    holder.style.position = 'fixed';
    holder.style.left = '-10000px';
    holder.style.top = '0';
    holder.style.opacity = '0';
    holder.style.pointerEvents = 'none';
    document.body.appendChild(holder);

    window.googleTranslateElementInitReact = () => {
      if (!window.google?.translate) return;
      // eslint-disable-next-line no-new
      new window.google.translate.TranslateElement(
        { pageLanguage: 'fr', autoDisplay: false },
        'google_translate_element_react',
      );
    };

    if (!document.querySelector('script[src*="translate.google.com/translate_a/element.js"]')) {
      const script = document.createElement('script');
      script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInitReact';
      script.async = true;
      document.body.appendChild(script);
    } else {
      window.googleTranslateElementInitReact();
    }
  }, []);

  const applyGoogleTranslate = (lang: string) => {
    try {
      document.cookie = `googtrans=/fr/${lang};path=/;max-age=31536000`;
      const combo = document.querySelector<HTMLSelectElement>('.goog-te-combo');
      if (combo) {
        combo.value = lang;
        combo.dispatchEvent(new Event('change'));
      }
    } catch {
      // ignore and keep i18n fallback only
    }
  };

  return (
    <select
      value={current}
      onChange={(e) => {
        const lang = e.target.value as 'fr' | 'en' | 'es' | 'ar' | 'pt' | 'zh';
        setLang(lang);
        applyGoogleTranslate(lang);
      }}
      aria-label="Language selector"
      className="h-10 min-w-[168px] rounded-[10px] border border-[#dbe1ee] bg-white px-3 text-[0.95rem] font-bold text-[#1a4d8f] outline-none focus:border-[#0f3466] focus:shadow-[0_0_0_3px_rgba(15,52,102,0.12)]"
    >
      {languages.map((lang) => (
        <option key={lang.code} value={lang.code}>
          {lang.label}
        </option>
      ))}
    </select>
  );
};

export default LanguageSwitcher;

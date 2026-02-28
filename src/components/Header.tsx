import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from './LanguageSwitcher';
import logo from '../assets/logo.png';

const Header: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <header className="sticky top-0 z-[100] border-b border-[#e6eef8] bg-white/90 py-2 backdrop-blur-md shadow-[0_10px_30px_rgba(15,52,102,0.07)]">
      <div className="mx-auto flex w-full max-w-[1200px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <div
          className="cursor-pointer min-w-0"
          onClick={() => navigate('/')}
          aria-label={`${t('header.brandMain')} ${t('header.brandAccent')}`}
          title={`${t('header.brandMain')} ${t('header.brandAccent')}`}
        >
          <div className="h-14 sm:h-16 lg:h-20 w-[220px] sm:w-[320px] lg:w-[390px] overflow-hidden">
            <img src={logo} alt="Logo Mon Examen Civique" className="h-full w-full object-contain object-left" />
          </div>
        </div>
        <LanguageSwitcher />
      </div>
    </header>
  );
};

export default Header;

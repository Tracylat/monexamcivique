import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from './LanguageSwitcher';
import logo from '../assets/logo.png';

const Header: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <header className="bg-white shadow-[0_2px_16px_rgba(0,0,0,0.08)] sticky top-0 z-[100] py-3">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center gap-4">
        <div
          className="cursor-pointer"
          onClick={() => navigate('/')}
          aria-label={`${t('header.brandMain')} ${t('header.brandAccent')}`}
          title={`${t('header.brandMain')} ${t('header.brandAccent')}`}
        >
          <div className="h-24 sm:h-28 lg:h-36 w-[320px] sm:w-[420px] lg:w-[520px] overflow-hidden">
            <img src={logo} alt="Logo Mon Examen Civique" className="h-full w-full object-contain object-left" />
          </div>
        </div>
        <LanguageSwitcher />
      </div>
    </header>
  );
};

export default Header;

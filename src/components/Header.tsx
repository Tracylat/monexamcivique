import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from './LanguageSwitcher';
import logo from '../assets/logo.png';
import { isLoggedIn, logout } from '../utils/access';

const Header: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [logged, setLogged] = useState(false);

  useEffect(() => {
    setLogged(isLoggedIn());
  }, []);

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
        <div className="flex items-center gap-2 sm:gap-3">
          {logged && (
            <>
              <button
                type="button"
                onClick={() => navigate('/espace')}
                className="rounded-lg border border-[#d7e3f4] bg-white px-3 py-1.5 text-xs sm:text-sm font-semibold text-[#1a4d8f] hover:bg-[#eef4fb]"
              >
                Espace client
              </button>
              <button
                type="button"
                onClick={() => {
                  logout();
                  navigate('/');
                }}
                className="rounded-lg border border-[#f3d6d6] bg-white px-3 py-1.5 text-xs sm:text-sm font-semibold text-[#b42318] hover:bg-[#fff5f5]"
              >
                Déconnexion
              </button>
            </>
          )}
          <LanguageSwitcher />
        </div>
      </div>
    </header>
  );
};

export default Header;

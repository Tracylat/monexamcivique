import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from './LanguageSwitcher';
import logo from '../assets/logo.png';
import { disableDemoAccess, enableDemoAccess, isDemoAccessEnabled, isLoggedIn, logout } from '../utils/access';

const Header: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [logged, setLogged] = useState(false);
  const [demo, setDemo] = useState(false);

  useEffect(() => {
    const updateLoggedState = () => {
      setLogged(isLoggedIn());
      setDemo(isDemoAccessEnabled());
    };
    updateLoggedState();
    window.addEventListener('auth-changed', updateLoggedState);
    window.addEventListener('storage', updateLoggedState);
    return () => {
      window.removeEventListener('auth-changed', updateLoggedState);
      window.removeEventListener('storage', updateLoggedState);
    };
  }, []);

  return (
    <header className="sticky top-0 z-[100] border-b border-[#e6eef8] bg-white/95 py-1.5 backdrop-blur-md shadow-[0_10px_30px_rgba(15,52,102,0.07)]">
      <div className="mx-auto flex w-full max-w-[1200px] items-center justify-between gap-2 sm:gap-3 px-3 sm:px-6 lg:px-8">
        <div
          className="cursor-pointer min-w-0"
          onClick={() => navigate('/')}
          aria-label={`${t('header.brandMain')} ${t('header.brandAccent')}`}
          title={`${t('header.brandMain')} ${t('header.brandAccent')}`}
        >
          <div className="h-12 sm:h-20 lg:h-24 w-[175px] sm:w-[330px] lg:w-[430px] overflow-hidden">
            <img
              src={logo}
              alt="Logo Mon Examen Civique"
              className="h-full w-full object-contain object-left scale-[1.35] origin-left"
            />
          </div>
        </div>
        <div className="flex items-center gap-1.5 sm:gap-3">
          {logged && (
            <>
              <button
                type="button"
                onClick={() => navigate('/espace')}
                className="rounded-lg border border-[#d7e3f4] bg-white px-2.5 sm:px-3 py-1.5 text-[11px] sm:text-sm font-semibold text-[#1a4d8f] hover:bg-[#eef4fb]"
              >
                Espace client
              </button>
              <button
                type="button"
                onClick={() => {
                  logout();
                  navigate('/');
                }}
                className="rounded-lg border border-[#f3d6d6] bg-white px-2.5 sm:px-3 py-1.5 text-[11px] sm:text-sm font-semibold text-[#b42318] hover:bg-[#fff5f5]"
              >
                Déconnexion
              </button>
            </>
          )}
          <button
            type="button"
            onClick={() => {
              if (demo) {
                disableDemoAccess();
                navigate('/');
                return;
              }
              enableDemoAccess();
              navigate('/choice');
            }}
            className={`rounded-lg border px-2.5 sm:px-3 py-1.5 text-[11px] sm:text-sm font-semibold ${
              demo
                ? 'border-[#f3d6d6] bg-[#fff5f5] text-[#b42318] hover:bg-[#ffe9ea]'
                : 'border-[#d7e3f4] bg-white text-[#1a4d8f] hover:bg-[#eef4fb]'
            }`}
            title={demo ? 'Désactiver le mode test' : 'Activer le mode test'}
          >
            {demo ? 'Mode test actif' : 'Mode test'}
          </button>
          <LanguageSwitcher />
        </div>
      </div>
    </header>
  );
};

export default Header;

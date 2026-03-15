import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '../components/LanguageSwitcher';
import { isSupabaseConfigured, supabase } from '../lib/supabase';
import './Auth.css';
import logo from '../assets/logo.png';

const ResetPasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const { i18n } = useTranslation();
  const tr = (fr: string, en: string) => ((i18n.resolvedLanguage || 'fr').startsWith('fr') ? fr : en);

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isReady, setIsReady] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) {
      setErrorMessage(
        tr(
          "Configuration Supabase manquante: ajoutez VITE_SUPABASE_URL et VITE_SUPABASE_ANON_KEY.",
          "Missing Supabase configuration: add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.",
        ),
      );
      return;
    }

    let mounted = true;

    const bootstrapRecovery = async () => {
      const hashParams = new URLSearchParams(window.location.hash.replace(/^#/, ''));
      const searchParams = new URLSearchParams(window.location.search);
      const code = searchParams.get('code');
      const tokenHash = searchParams.get('token_hash');
      const flowType = searchParams.get('type') || hashParams.get('type');
      const accessToken = hashParams.get('access_token');
      const refreshToken = hashParams.get('refresh_token');
      const errorDescription = hashParams.get('error_description') || searchParams.get('error_description');

      if (errorDescription && mounted) {
        setErrorMessage(decodeURIComponent(errorDescription.replace(/\+/g, ' ')));
      }

      if (code) {
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        if (error) {
          if (mounted) setErrorMessage(error.message);
          return;
        }
      } else if (tokenHash && flowType === 'recovery') {
        const { error } = await supabase.auth.verifyOtp({
          type: 'recovery',
          token_hash: tokenHash,
        });
        if (error) {
          if (mounted) setErrorMessage(error.message);
          return;
        }
      } else if (accessToken && refreshToken) {
        const { error } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        });
        if (error) {
          if (mounted) setErrorMessage(error.message);
          return;
        }
      }

      const { data } = await supabase.auth.getSession();
      if (!mounted) return;
      if (!data.session) {
        setErrorMessage(
          tr(
            "Lien invalide ou expiré. Demandez un nouveau lien de réinitialisation.",
            "Invalid or expired link. Request a new reset link.",
          ),
        );
        return;
      }

      setIsReady(true);
      // Clean URL after successful bootstrap.
      window.history.replaceState({}, document.title, '/reset-password');
    };

    void bootstrapRecovery();

    return () => {
      mounted = false;
    };
  }, [i18n.resolvedLanguage]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!supabase) {
      setErrorMessage(tr('Supabase non disponible.', 'Supabase not available.'));
      return;
    }
    if (password.length < 6) {
      setErrorMessage(tr('Mot de passe trop court (minimum 6 caractères).', 'Password is too short (minimum 6 characters).'));
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage(tr('Les mots de passe ne correspondent pas.', 'Passwords do not match.'));
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) {
        setErrorMessage(error.message);
        return;
      }

      setSuccessMessage(
        tr(
          'Mot de passe mis à jour. Redirection vers la connexion...',
          'Password updated. Redirecting to login...',
        ),
      );
      setTimeout(() => navigate('/login', { replace: true }), 900);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-shell">
      <div className="auth-glow auth-glow-left" />
      <div className="auth-glow auth-glow-right" />
      <div className="auth-panel">
        <div className="flex items-start justify-between gap-3 mb-4">
          <button
            type="button"
            onClick={() => navigate('/')}
            style={{ background: 'transparent', border: 0, padding: 0, cursor: 'pointer' }}
            aria-label="Aller à l'accueil"
            title="Mon Examen Civique"
          >
            <img src={logo} alt="Logo Mon Examen Civique" style={{ height: 56, width: 'auto' }} />
          </button>
          <LanguageSwitcher />
        </div>

        <div className="auth-brand">
          <h1>{tr('Réinitialiser le mot de passe', 'Reset password')}</h1>
          <p className="auth-subtitle">
            {tr(
              'Choisissez un nouveau mot de passe pour votre compte.',
              'Choose a new password for your account.',
            )}
          </p>
        </div>

        {!isReady && !errorMessage && (
          <p className="auth-message auth-success">
            {tr('Vérification du lien de réinitialisation...', 'Checking reset link...')}
          </p>
        )}

        {errorMessage && <p className="auth-message auth-error">{errorMessage}</p>}
        {successMessage && <p className="auth-message auth-success">{successMessage}</p>}

        <form className="auth-form" onSubmit={handleSubmit}>
          <label>
            {tr('Nouveau mot de passe', 'New password')}
            <input
              type="password"
              placeholder={tr('Entrez votre nouveau mot de passe', 'Enter your new password')}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={!isReady || isSubmitting}
            />
          </label>

          <label>
            {tr('Confirmez le nouveau mot de passe', 'Confirm new password')}
            <input
              type="password"
              placeholder={tr('Retapez votre mot de passe', 'Re-enter your password')}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              disabled={!isReady || isSubmitting}
            />
          </label>

          <button type="submit" className="auth-submit" disabled={!isReady || isSubmitting}>
            {isSubmitting
              ? tr('Mise à jour...', 'Updating...')
              : tr('Mettre à jour le mot de passe', 'Update password')}
          </button>

          <button type="button" className="auth-switch" onClick={() => navigate('/login')}>
            ← {tr('Retour', 'Back')}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPasswordPage;

import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '../components/LanguageSwitcher';
import { isSupabaseConfigured, supabase } from '../lib/supabase';
import { setAuthUserFromSupabaseUser } from '../utils/access';
import './Auth.css';

type LoginFormState = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t, i18n } = useTranslation();
  const [isLogin, setIsLogin] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [form, setForm] = useState<LoginFormState>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const updateField = (field: keyof LoginFormState, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };
  const tr = (fr: string, en: string) => (i18n.resolvedLanguage === 'en' ? en : fr);

  const nextFromQuery = (() => {
    const params = new URLSearchParams(location.search);
    const next = params.get('next');
    return next && next.startsWith('/') ? next : '/choice';
  })();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!isLogin && form.password !== form.confirmPassword) {
      setErrorMessage(t('auth.passwordMismatch'));
      return;
    }

    setIsSubmitting(true);
    try {
      if (!isSupabaseConfigured || !supabase) {
        setErrorMessage(
          tr(
            "Configuration Supabase manquante: ajoutez VITE_SUPABASE_URL et VITE_SUPABASE_ANON_KEY.",
            "Missing Supabase configuration: add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.",
          ),
        );
        return;
      }

      if (isLogin) {
        const normalizedEmail = form.email.trim().toLowerCase();
        const { data, error } = await supabase.auth.signInWithPassword({
          email: normalizedEmail,
          password: form.password,
        });

        if (error) {
          const message = error.message || t('auth.genericError');
          if (/invalid login credentials/i.test(message)) {
            setErrorMessage(
              tr(
                "Identifiants invalides. Vérifiez l'e-mail/mot de passe, et confirmez votre e-mail si nécessaire.",
                'Invalid credentials. Check your email/password, and confirm your email if needed.',
              ),
            );
            return;
          }
          if (/email not confirmed/i.test(message)) {
            setErrorMessage(
              tr(
                "Votre e-mail n'est pas encore confirmé. Vérifiez votre boîte mail.",
                'Your email is not confirmed yet. Please check your inbox.',
              ),
            );
            return;
          }
          setErrorMessage(message);
          return;
        }

        setAuthUserFromSupabaseUser(data.user ?? null);
        navigate(nextFromQuery);
        return;
      }

      const { data, error } = await supabase.auth.signUp({
        email: form.email.trim().toLowerCase(),
        password: form.password,
        options: {
          data: {
            full_name: form.name || form.email.split('@')[0] || 'Utilisateur',
          },
        },
      });

      if (error) {
        setErrorMessage(error.message || t('auth.genericError'));
        return;
      }

      if (data.session && data.user) {
        setAuthUserFromSupabaseUser(data.user);
        navigate(nextFromQuery);
        return;
      }

      setSuccessMessage(
        tr(
          "Compte créé. Vérifiez votre e-mail puis connectez-vous.",
          "Account created. Check your email, then sign in.",
        ),
      );
      setIsLogin(true);
      setForm((prev) => ({ ...prev, password: '', confirmPassword: '' }));
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : t('auth.genericError'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleForgotPassword = async () => {
    setErrorMessage('');
    setSuccessMessage('');

    if (!supabase || !isSupabaseConfigured) {
      setErrorMessage(
        tr(
          "Configuration Supabase manquante: ajoutez VITE_SUPABASE_URL et VITE_SUPABASE_ANON_KEY.",
          "Missing Supabase configuration: add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.",
        ),
      );
      return;
    }

    const email = form.email.trim().toLowerCase();
    if (!email) {
      setErrorMessage(tr('Entrez votre e-mail puis cliquez sur mot de passe oublié.', 'Enter your email then click forgot password.'));
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/login`,
      });
      if (error) {
        setErrorMessage(error.message);
        return;
      }
      setSuccessMessage(
        tr(
          "E-mail de réinitialisation envoyé. Vérifiez votre boîte mail.",
          'Reset email sent. Please check your inbox.',
        ),
      );
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : t('auth.genericError'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleMagicLinkLogin = async () => {
    setErrorMessage('');
    setSuccessMessage('');

    if (!supabase || !isSupabaseConfigured) {
      setErrorMessage(
        tr(
          "Configuration Supabase manquante: ajoutez VITE_SUPABASE_URL et VITE_SUPABASE_ANON_KEY.",
          "Missing Supabase configuration: add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.",
        ),
      );
      return;
    }

    const email = form.email.trim().toLowerCase();
    if (!email) {
      setErrorMessage(tr("Entrez votre e-mail pour recevoir un lien de connexion.", "Enter your email to receive a login link."));
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/login`,
          shouldCreateUser: true,
        },
      });

      if (error) {
        setErrorMessage(error.message);
        return;
      }

      setSuccessMessage(
        tr(
          "Lien magique envoyé. Ouvrez votre e-mail et cliquez sur le lien pour vous connecter.",
          "Magic link sent. Open your email and click the link to sign in.",
        ),
      );
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : t('auth.genericError'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-shell">
      <div className="auth-glow auth-glow-left" />
      <div className="auth-glow auth-glow-right" />

      <section className="auth-panel">
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 8 }}>
          <LanguageSwitcher />
        </div>
        <div className="auth-brand">
          <p className="auth-badge">{t('auth.badge')}</p>
          <h1>{isLogin ? t('auth.loginTitle') : t('auth.signupTitle')}</h1>
          <p className="auth-subtitle">
            {isLogin
              ? t('auth.loginSubtitle')
              : t('auth.signupSubtitle')}
          </p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          {!isLogin && (
            <label>
              {t('auth.fullName')}
              <input
                type="text"
                placeholder={t('auth.fullNamePlaceholder')}
                value={form.name}
                onChange={(e) => updateField('name', e.target.value)}
                required
              />
            </label>
          )}

          <label>
            {t('auth.email')}
            <input
              type="email"
              placeholder={t('auth.emailPlaceholder')}
              value={form.email}
              onChange={(e) => updateField('email', e.target.value)}
              required
            />
          </label>

          <label>
            {t('auth.password')}
            <input
              type="password"
              placeholder={t('auth.passwordPlaceholder')}
              value={form.password}
              onChange={(e) => updateField('password', e.target.value)}
              required
            />
          </label>

          {!isLogin && (
            <label>
              {t('auth.confirmPassword')}
              <input
                type="password"
                placeholder={t('auth.confirmPasswordPlaceholder')}
                value={form.confirmPassword}
                onChange={(e) => updateField('confirmPassword', e.target.value)}
                required
              />
            </label>
          )}

          {errorMessage && <p className="auth-message auth-error">{errorMessage}</p>}
          {successMessage && <p className="auth-message auth-success">{successMessage}</p>}

          <button type="submit" className="auth-submit" disabled={isSubmitting}>
            {isSubmitting ? t('auth.submitLoading') : isLogin ? t('auth.submitLogin') : t('auth.submitSignup')}
          </button>

          {isLogin && (
            <button
              type="button"
              className="auth-switch"
              onClick={handleForgotPassword}
              disabled={isSubmitting}
            >
              {tr('Mot de passe oublié ?', 'Forgot password?')}
            </button>
          )}

          {isLogin && (
            <button
              type="button"
              className="auth-switch"
              onClick={handleMagicLinkLogin}
              disabled={isSubmitting}
            >
              {tr('Connexion sans mot de passe (lien magique)', 'Passwordless login (magic link)')}
            </button>
          )}

          <button
            type="button"
            className="auth-switch"
            onClick={() => {
              setIsLogin((prev) => !prev);
              setErrorMessage('');
              setSuccessMessage('');
            }}
          >
            {isLogin ? t('auth.switchToSignup') : t('auth.switchToLogin')}
          </button>
        </form>
      </section>
    </div>
  );
};

export default LoginPage;

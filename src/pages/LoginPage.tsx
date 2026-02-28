import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '../components/LanguageSwitcher';
import { isSupabaseConfigured, supabase } from '../lib/supabase';
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
      const tr = (fr: string, en: string) => (i18n.resolvedLanguage === 'en' ? en : fr);
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
        const { data, error } = await supabase.auth.signInWithPassword({
          email: form.email,
          password: form.password,
        });

        if (error) {
          setErrorMessage(error.message || t('auth.genericError'));
          return;
        }

        localStorage.setItem(
          'auth_user',
          JSON.stringify({
            id: data.user?.id,
            email: data.user?.email,
            name: data.user?.user_metadata?.full_name || data.user?.email?.split('@')[0] || 'Utilisateur',
          }),
        );
        navigate(nextFromQuery);
        return;
      }

      const { data, error } = await supabase.auth.signUp({
        email: form.email,
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
        localStorage.setItem(
          'auth_user',
          JSON.stringify({
            id: data.user.id,
            email: data.user.email,
            name: data.user.user_metadata?.full_name || data.user.email?.split('@')[0] || 'Utilisateur',
          }),
        );
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

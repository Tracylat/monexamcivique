import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '../components/LanguageSwitcher';
import { isSupabaseConfigured, supabase } from '../lib/supabase';
import { setAuthUserFromSupabaseUser } from '../utils/access';
import './Auth.css';
import logo from '../assets/logo.png';

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
  const tr = (fr: string, en: string) => ((i18n.resolvedLanguage || 'fr').startsWith('fr') ? fr : en);

  const [isLogin, setIsLogin] = useState(true);
  const [isRecoveryMode, setIsRecoveryMode] = useState(false);
  const [useCodeReset, setUseCodeReset] = useState(false);
  const [resetCodeSent, setResetCodeSent] = useState(false);
  const [resetCode, setResetCode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [form, setForm] = useState<LoginFormState>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const loginRedirectUrl = `${window.location.origin}/login`;
  const resetRedirectUrl = `${window.location.origin}/reset-password`;

  const updateField = (field: keyof LoginFormState, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  useEffect(() => {
    if (!supabase) return;

    let mounted = true;

    const detectRecoveryFlow = async () => {
      const hashParams = new URLSearchParams(window.location.hash.replace(/^#/, ''));
      const searchParams = new URLSearchParams(window.location.search);
      const flowType = hashParams.get('type') || searchParams.get('type');
      const code = searchParams.get('code');
      const tokenHash = searchParams.get('token_hash');
      const accessToken = hashParams.get('access_token');
      const refreshToken = hashParams.get('refresh_token');
      const errorDescription = hashParams.get('error_description') || searchParams.get('error_description');

      if (errorDescription && mounted) {
        setErrorMessage(decodeURIComponent(errorDescription.replace(/\+/g, ' ')));
      }

      if (code) {
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        if (error && mounted) {
          setErrorMessage(error.message);
          return;
        }
      } else if (tokenHash && flowType === 'recovery') {
        const { error } = await supabase.auth.verifyOtp({
          type: 'recovery',
          token_hash: tokenHash,
        });
        if (error && mounted) {
          setErrorMessage(error.message);
          return;
        }
      } else if (accessToken && refreshToken) {
        const { error } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        });
        if (error && mounted) {
          setErrorMessage(error.message);
          return;
        }
      }

      if (!mounted) return;

      if (location.pathname === '/reset-password' || flowType === 'recovery' || Boolean(code) || Boolean(tokenHash) || Boolean(accessToken && refreshToken)) {
        setIsRecoveryMode(true);
        setIsLogin(true);
        setUseCodeReset(false);
        setSuccessMessage(tr('Lien de récupération détecté. Entrez votre nouveau mot de passe.', 'Recovery link detected. Enter your new password.'));
        const cleanPath = location.pathname === '/reset-password' ? '/reset-password' : '/login';
        window.history.replaceState({}, document.title, cleanPath);
      }
    };

    void detectRecoveryFlow();

    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'PASSWORD_RECOVERY') {
        setIsRecoveryMode(true);
        setIsLogin(true);
      }
      if (event === 'SIGNED_IN') {
        setAuthUserFromSupabaseUser(session?.user ?? null);
      }
    });

    return () => {
      mounted = false;
      data.subscription.unsubscribe();
    };
  }, [i18n.resolvedLanguage, location.pathname]);

  const nextFromQuery = (() => {
    const params = new URLSearchParams(location.search);
    const next = params.get('next');
    return next && next.startsWith('/') ? next : '/choice';
  })();

  const ensureSupabase = () => {
    if (!supabase || !isSupabaseConfigured) {
      setErrorMessage(
        tr(
          'Configuration Supabase manquante: ajoutez VITE_SUPABASE_URL et VITE_SUPABASE_ANON_KEY.',
          'Missing Supabase configuration: add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.',
        ),
      );
      return false;
    }
    return true;
  };

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
      if (!ensureSupabase() || !supabase) return;

      if (isRecoveryMode) {
        if (form.password.length < 6) {
          setErrorMessage(tr('Mot de passe trop court (minimum 6 caractères).', 'Password is too short (minimum 6 characters).'));
          return;
        }
        if (form.password !== form.confirmPassword) {
          setErrorMessage(t('auth.passwordMismatch'));
          return;
        }

        const { error } = await supabase.auth.updateUser({ password: form.password });
        if (error) {
          setErrorMessage(error.message || t('auth.genericError'));
          return;
        }

        setSuccessMessage(tr('Mot de passe mis à jour. Connectez-vous maintenant.', 'Password updated. You can now sign in.'));
        setIsRecoveryMode(false);
        setForm((prev) => ({ ...prev, password: '', confirmPassword: '' }));
        navigate('/login', { replace: true });
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
          emailRedirectTo: loginRedirectUrl,
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

      setSuccessMessage(tr('Compte créé. Vérifiez votre e-mail puis connectez-vous.', 'Account created. Check your email, then sign in.'));
      setIsLogin(true);
      setForm((prev) => ({ ...prev, password: '', confirmPassword: '' }));
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : t('auth.genericError'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleMagicLinkLogin = async () => {
    setErrorMessage('');
    setSuccessMessage('');

    if (!ensureSupabase() || !supabase) return;

    const email = form.email.trim().toLowerCase();
    if (!email) {
      setErrorMessage(tr('Entrez votre e-mail pour recevoir un lien de connexion.', 'Enter your email to receive a login link.'));
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: loginRedirectUrl,
          shouldCreateUser: true,
        },
      });

      if (error) {
        setErrorMessage(error.message);
        return;
      }

      setSuccessMessage(tr('Lien magique envoyé. Ouvrez votre e-mail et cliquez sur le lien pour vous connecter.', 'Magic link sent. Open your email and click the link to sign in.'));
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : t('auth.genericError'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSendResetCode = async () => {
    setErrorMessage('');
    setSuccessMessage('');

    if (!ensureSupabase() || !supabase) return;

    const email = form.email.trim().toLowerCase();
    if (!email) {
      setErrorMessage(tr('Entrez votre e-mail.', 'Enter your email.'));
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: resetRedirectUrl,
      });

      if (error) {
        setErrorMessage(error.message);
        return;
      }

      setResetCodeSent(true);
      setSuccessMessage(tr('Code envoyé par e-mail. Saisissez le code reçu pour continuer.', 'Code sent by email. Enter the code you received to continue.'));
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : t('auth.genericError'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerifyResetCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!ensureSupabase() || !supabase) return;

    const email = form.email.trim().toLowerCase();
    if (!email) {
      setErrorMessage(tr('Entrez votre e-mail.', 'Enter your email.'));
      return;
    }
    if (!resetCode.trim()) {
      setErrorMessage(tr('Entrez le code reçu par e-mail.', 'Enter the code received by email.'));
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await supabase.auth.verifyOtp({
        email,
        token: resetCode.trim(),
        type: 'recovery',
      });

      if (error) {
        setErrorMessage(tr('Code invalide ou expiré. Demandez un nouveau code.', 'Invalid or expired code. Request a new code.'));
        return;
      }

      setSuccessMessage(tr('Code vérifié. Redirection vers la page de nouveau mot de passe...', 'Code verified. Redirecting to the new password page...'));
      setTimeout(() => navigate('/reset-password'), 400);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : t('auth.genericError'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <div className="topbar">
        <button
          type="button"
          onClick={() => navigate('/')}
          style={{ background: 'transparent', border: 0, padding: 0, cursor: 'pointer' }}
          aria-label="Aller à l'accueil"
          title="Mon Examen Civique"
        >
          <img src={logo} alt="Logo Mon Examen Civique" style={{ height: 84, width: 'auto' }} />
        </button>
        <div style={{ marginLeft: 'auto' }}>
          <LanguageSwitcher />
        </div>
      </div>
      <div className="tricolor" />

      <div className="wrap">
        <div className="card-nav" style={{ marginBottom: 12 }}>
          <button
            type="button"
            className="nav-btn nav-back"
            onClick={() => {
              if (window.history.length > 1) {
                navigate(-1);
                return;
              }
              const last = sessionStorage.getItem('lastVisitedPath');
              if (last) navigate(last);
            }}
          >
            ← {tr('Retour', 'Back')}
          </button>
        </div>

        <section className="card visible" style={{ display: 'block' }}>
          <h2 className="dg">
            {isRecoveryMode
              ? tr('Nouveau mot de passe', 'New password')
              : useCodeReset
                ? tr('Réinitialiser par code', 'Reset with code')
                : isLogin
                  ? t('auth.loginTitle')
                  : t('auth.signupTitle')}
          </h2>
          <p className="card-sub">
            {isRecoveryMode
              ? tr('Choisissez un nouveau mot de passe pour votre compte.', 'Choose a new password for your account.')
              : useCodeReset
                ? tr('Recevez un code par e-mail, puis saisissez-le ici.', 'Receive a code by email, then enter it here.')
                : isLogin
                  ? t('auth.loginSubtitle')
                  : t('auth.signupSubtitle')}
          </p>

          <div style={{ marginBottom: 12 }}>
            <p className="auth-badge">{t('auth.badge')}</p>
          </div>

          {useCodeReset && !isRecoveryMode ? (
            <form className="auth-form" onSubmit={handleVerifyResetCode}>
              <div className="field">
                <label>{t('auth.email')}</label>
                <input
                  type="email"
                  placeholder={t('auth.emailPlaceholder')}
                  value={form.email}
                  onChange={(e) => updateField('email', e.target.value)}
                  required
                />
              </div>

              {resetCodeSent && (
                <div className="field">
                  <label>{tr('Code reçu par e-mail', 'Code received by email')}</label>
                  <input
                    type="text"
                    placeholder={tr('Entrez le code', 'Enter the code')}
                    value={resetCode}
                    onChange={(e) => setResetCode(e.target.value)}
                    required
                  />
                </div>
              )}

              {errorMessage && <p className="auth-message auth-error">{errorMessage}</p>}
              {successMessage && <p className="auth-message auth-success">{successMessage}</p>}

              {!resetCodeSent ? (
                <button type="button" className="nav-btn nav-next" disabled={isSubmitting} style={{ width: '100%' }} onClick={handleSendResetCode}>
                  {isSubmitting ? tr('Envoi...', 'Sending...') : tr('Envoyer le code', 'Send code')}
                </button>
              ) : (
                <button type="submit" className="nav-btn nav-next" disabled={isSubmitting} style={{ width: '100%' }}>
                  {isSubmitting ? tr('Vérification...', 'Verifying...') : tr('Vérifier le code', 'Verify code')}
                </button>
              )}

              <div className="card-nav" style={{ marginTop: 14, flexDirection: 'column', alignItems: 'stretch' }}>
                <button
                  type="button"
                  className="auth-switch"
                  onClick={() => {
                    setUseCodeReset(false);
                    setResetCodeSent(false);
                    setResetCode('');
                    setErrorMessage('');
                    setSuccessMessage('');
                  }}
                >
                  {tr('Retour à la connexion', 'Back to login')}
                </button>
              </div>
            </form>
          ) : (
            <form className="auth-form" onSubmit={handleSubmit}>
              {!isLogin && !isRecoveryMode && (
                <div className="field">
                  <label>{t('auth.fullName')}</label>
                  <input
                    type="text"
                    placeholder={t('auth.fullNamePlaceholder')}
                    value={form.name}
                    onChange={(e) => updateField('name', e.target.value)}
                    required
                  />
                </div>
              )}

              {!isRecoveryMode && (
                <div className="field">
                  <label>{t('auth.email')}</label>
                  <input
                    type="email"
                    placeholder={t('auth.emailPlaceholder')}
                    value={form.email}
                    onChange={(e) => updateField('email', e.target.value)}
                    required
                  />
                </div>
              )}

              <div className="field">
                <label>{isRecoveryMode ? tr('Nouveau mot de passe', 'New password') : t('auth.password')}</label>
                <input
                  type="password"
                  placeholder={isRecoveryMode ? tr('Entrez votre nouveau mot de passe', 'Enter your new password') : t('auth.passwordPlaceholder')}
                  value={form.password}
                  onChange={(e) => updateField('password', e.target.value)}
                  required
                />
              </div>

              {(!isLogin || isRecoveryMode) && (
                <div className="field">
                  <label>{isRecoveryMode ? tr('Confirmez le nouveau mot de passe', 'Confirm new password') : t('auth.confirmPassword')}</label>
                  <input
                    type="password"
                    placeholder={isRecoveryMode ? tr('Retapez le nouveau mot de passe', 'Re-enter the new password') : t('auth.confirmPasswordPlaceholder')}
                    value={form.confirmPassword}
                    onChange={(e) => updateField('confirmPassword', e.target.value)}
                    required
                  />
                </div>
              )}

              {errorMessage && <p className="auth-message auth-error">{errorMessage}</p>}
              {successMessage && <p className="auth-message auth-success">{successMessage}</p>}

              <button type="submit" className="nav-btn nav-next" disabled={isSubmitting} style={{ width: '100%' }}>
                {isSubmitting
                  ? t('auth.submitLoading')
                  : isRecoveryMode
                    ? tr('Mettre à jour le mot de passe', 'Update password')
                    : isLogin
                      ? t('auth.submitLogin')
                      : t('auth.submitSignup')}
              </button>

              <div className="card-nav" style={{ marginTop: 14, flexDirection: 'column', alignItems: 'stretch' }}>
                {isLogin && !isRecoveryMode && (
                  <button
                    type="button"
                    className="auth-switch"
                    onClick={() => {
                      setUseCodeReset(true);
                      setResetCodeSent(false);
                      setResetCode('');
                      setErrorMessage('');
                      setSuccessMessage('');
                    }}
                    disabled={isSubmitting}
                  >
                    {tr('Réinitialiser avec un code e-mail', 'Reset with email code')}
                  </button>
                )}

                {isLogin && !isRecoveryMode && (
                  <button
                    type="button"
                    className="auth-switch"
                    onClick={handleMagicLinkLogin}
                    disabled={isSubmitting}
                  >
                    {tr('Connexion sans mot de passe (lien magique)', 'Passwordless login (magic link)')}
                  </button>
                )}

                {!isRecoveryMode && (
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
                )}
              </div>
            </form>
          )}
        </section>
      </div>
    </div>
  );
};

export default LoginPage;

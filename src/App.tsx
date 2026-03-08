import { ReactElement, useEffect, useState } from 'react';
import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { supabase } from './lib/supabase';
import DashboardPage from './pages/DashboardPage';
import LoginPage from './pages/LoginPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import ChoicePage from './pages/ChoicePage';
import CheckoutPage from './pages/CheckoutPage';
import { PaymentProvider } from './context/PaymentContext';
import { getPurchasedPlans, isLoggedIn, setAuthUserFromSupabaseUser } from './utils/access';

type ProtectedRouteProps = { element: ReactElement };
type DesignPageProps = { src: string; title: string };

function DesignPage({ src, title }: DesignPageProps) {
  return (
    <iframe
      src={src}
      title={title}
      style={{ border: 0, width: '100%', height: '100vh', display: 'block' }}
      allow="clipboard-read; clipboard-write; fullscreen"
    />
  );
}

function RequireAuth({ element }: ProtectedRouteProps) {
  const location = useLocation();
  if (!isLoggedIn()) {
    const next = encodeURIComponent(`${location.pathname}${location.search}`);
    return <Navigate to={`/login?next=${next}`} replace />;
  }
  return element;
}

function RequirePaidPlan({ element }: ProtectedRouteProps) {
  if (getPurchasedPlans().length === 0) return <Navigate to="/choice" replace />;
  return element;
}

function RouteHistoryTracker() {
  const location = useLocation();

  useEffect(() => {
    const current = `${location.pathname}${location.search}`;
    const previous = sessionStorage.getItem('currentPath');
    if (previous && previous !== current) {
      sessionStorage.setItem('lastVisitedPath', previous);
    }
    sessionStorage.setItem('currentPath', current);
  }, [location.pathname, location.search]);

  return null;
}

function RecoveryRedirectGuard() {
  const location = useLocation();

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const hash = location.hash || '';
    const isRecoveryFlow =
      searchParams.get('type') === 'recovery' ||
      searchParams.has('code') ||
      searchParams.has('token_hash') ||
      hash.includes('type=recovery') ||
      hash.includes('access_token=') ||
      hash.includes('refresh_token=');

    if (location.pathname === '/' && isRecoveryFlow) {
      window.location.replace(`/reset-password${location.search}${location.hash}`);
    }
  }, [location.pathname, location.search, location.hash]);

  return null;
}

function App() {
  const [authReady, setAuthReady] = useState(!supabase);

  useEffect(() => {
    if (!supabase) {
      setAuthReady(true);
      return;
    }

    let mounted = true;
    void supabase.auth.getSession().then(({ data }) => {
      setAuthUserFromSupabaseUser(data.session?.user ?? null);
      if (mounted) setAuthReady(true);
    });

    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      setAuthUserFromSupabaseUser(session?.user ?? null);
    });

    return () => {
      mounted = false;
      data.subscription.unsubscribe();
    };
  }, []);

  if (!authReady) return null;

  return (
    <PaymentProvider>
      <BrowserRouter>
        <RouteHistoryTracker />
        <RecoveryRedirectGuard />
        <Routes>
          <Route path="/" element={<DesignPage src="/design/index.html" title="Mon Examen Civique - Accueil" />} />
          <Route path="/app/free" element={<DesignPage src="/design/test.html" title="Mon Examen Civique - Test Gratuit" />} />
          <Route path="/inscription" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/choice" element={<RequireAuth element={<ChoicePage />} />} />
          <Route path="/checkout" element={<RequireAuth element={<CheckoutPage />} />} />
          <Route path="/app" element={<RequireAuth element={<RequirePaidPlan element={<DesignPage src="/design/app.html" title="Mon Examen Civique - Espace Révision" />} />} />} />
          <Route path="/espace" element={<RequireAuth element={<DesignPage src="/design/app.html" title="Mon Examen Civique - Espace Révision" />} />} />
          <Route path="/dashboard" element={<RequireAuth element={<DesignPage src="/design/app.html" title="Mon Examen Civique - Dashboard" />} />} />
          <Route path="/admin/quiz" element={<RequireAuth element={<DashboardPage />} />} />
          <Route path="/admin/questions" element={<RequireAuth element={<DashboardPage />} />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </PaymentProvider>
  );
}

export default App;

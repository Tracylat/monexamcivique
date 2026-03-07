import { ReactElement, useEffect, useState } from 'react';
import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { supabase } from './lib/supabase';
import LoginPage from './pages/LoginPage';
import ChoicePage from './pages/ChoicePage';
import CheckoutPage from './pages/CheckoutPage';
import UserSpacePage from './pages/UserSpacePage';
import DashboardPage from './pages/DashboardPage';
import { PaymentProvider } from './context/PaymentContext';
import { getPurchasedPlans, isLoggedIn, setAuthUserFromSupabaseUser } from './utils/access';

function StaticHtmlPage({ src }: { src: string }) {
  return (
    <iframe
      src={src}
      title={src}
      style={{ display: 'block', width: '100%', height: '100vh', border: 0, background: '#fff' }}
    />
  );
}

type ProtectedRouteProps = { element: ReactElement };

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
        <Routes>
          <Route path="/" element={<StaticHtmlPage src="/design/index.html" />} />
          <Route path="/app/free" element={<StaticHtmlPage src="/design/test.html" />} />
          <Route path="/inscription" element={<Navigate to="/login?next=%2Fchoice" replace />} />
          <Route path="/app" element={<RequireAuth element={<RequirePaidPlan element={<StaticHtmlPage src="/design/app.html" />} />} />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/choice" element={<RequireAuth element={<ChoicePage />} />} />
          <Route path="/checkout" element={<RequireAuth element={<CheckoutPage />} />} />
          <Route path="/espace" element={<RequireAuth element={<UserSpacePage />} />} />
          <Route path="/dashboard" element={<RequireAuth element={<DashboardPage />} />} />
          <Route path="/admin/quiz" element={<RequireAuth element={<DashboardPage />} />} />
          <Route path="/admin/questions" element={<RequireAuth element={<DashboardPage />} />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </PaymentProvider>
  );
}

export default App;

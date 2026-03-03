import { ReactElement, useEffect, useState } from 'react';
import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import AppPage from './pages/AppPage';
import CheckoutPage from './pages/CheckoutPage';
import ChoicePage from './pages/ChoicePage';
import DashboardPage from './pages/DashboardPage';
import FreePage from './pages/FreePage';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import { supabase } from './lib/supabase';
import { PaymentProvider } from './context/PaymentContext';
import UserSpacePage from './pages/UserSpacePage';
import { getPurchasedPlans, isDemoAccessEnabled, isLoggedIn, setAuthUserFromSupabaseUser } from './utils/access';

type ProtectedRouteProps = {
  element: ReactElement;
};

function RequireAuth({ element }: ProtectedRouteProps) {
  const location = useLocation();
  if (isDemoAccessEnabled()) {
    return element;
  }
  if (!isLoggedIn()) {
    const next = encodeURIComponent(`${location.pathname}${location.search}`);
    return <Navigate to={`/login?next=${next}`} replace />;
  }
  return element;
}

function RequirePaidPlan({ element }: ProtectedRouteProps) {
  const purchasedPlans = getPurchasedPlans();
  if (purchasedPlans.length === 0) {
    return <Navigate to="/choice" replace />;
  }
  return element;
}

function ScrollToTop() {
  const location = useLocation();
  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace('#', '');
      const target = document.getElementById(id);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        return;
      }
    }
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
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

  if (!authReady) {
    return null;
  }

  return (
    <PaymentProvider>
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/choice" element={<RequireAuth element={<ChoicePage />} />} />
          <Route path="/app/free" element={<FreePage />} />
          <Route path="/app" element={<RequireAuth element={<RequirePaidPlan element={<AppPage />} />} />} />
          <Route path="/espace" element={<RequireAuth element={<UserSpacePage />} />} />
          <Route path="/dashboard" element={<RequireAuth element={<DashboardPage />} />} />
          <Route path="/admin/quiz" element={<RequireAuth element={<DashboardPage />} />} />
          <Route path="/admin/questions" element={<RequireAuth element={<DashboardPage />} />} />
          <Route path="/checkout" element={<RequireAuth element={<CheckoutPage />} />} />
        </Routes>
      </BrowserRouter>
    </PaymentProvider>
  );
}

export default App;

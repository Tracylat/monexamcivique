import { ReactElement } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import AppPage from './pages/AppPage';
import CheckoutPage from './pages/CheckoutPage';
import ChoicePage from './pages/ChoicePage';
import DashboardPage from './pages/DashboardPage';
import FreePage from './pages/FreePage';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import { PaymentProvider } from './context/PaymentContext';

type ProtectedRouteProps = {
  element: ReactElement;
};

function ProtectedRoute({ element }: ProtectedRouteProps) {
  return element;
}

function App() {
  return (
    <PaymentProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/choice" element={<ChoicePage />} />
          <Route path="/app/free" element={<FreePage />} />
          <Route path="/app" element={<ProtectedRoute element={<AppPage />} />} />
          <Route path="/dashboard" element={<ProtectedRoute element={<DashboardPage />} />} />
          <Route path="/admin/quiz" element={<ProtectedRoute element={<DashboardPage />} />} />
          <Route path="/admin/questions" element={<ProtectedRoute element={<DashboardPage />} />} />
          <Route path="/checkout" element={<CheckoutPage />} />
        </Routes>
      </BrowserRouter>
    </PaymentProvider>
  );
}

export default App;

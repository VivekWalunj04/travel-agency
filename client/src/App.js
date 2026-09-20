import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './index.css';

import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar    from './components/Navbar';
import Footer    from './components/Footer';

// ─── Pages (lazy-loaded) ─────────────────────────────────────────────────────
import HomePage          from './pages/HomePage';
import PackagesPage      from './pages/PackagesPage';
import PackageDetailPage from './pages/PackageDetailPage';
import BookingPage       from './pages/BookingPage';
import LoginPage         from './pages/LoginPage';
import RegisterPage      from './pages/RegisterPage';
import DashboardPage     from './pages/DashboardPage';
import AdminPage         from './pages/AdminPage';
import NotFoundPage      from './pages/NotFoundPage';

// ─── Route Guards ─────────────────────────────────────────────────────────────
const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="loading-center"><div className="spinner" /></div>;
  return user ? children : <Navigate to="/login" replace />;
};

const AdminRoute = ({ children }) => {
  const { user, isAdmin, loading } = useAuth();
  if (loading) return <div className="loading-center"><div className="spinner" /></div>;
  if (!user)    return <Navigate to="/login" replace />;
  if (!isAdmin) return <Navigate to="/"      replace />;
  return children;
};

const AppRoutes = () => (
  <>
    <Navbar />
    <main style={{ minHeight: 'calc(100vh - 72px)' }}>
      <Routes>
        <Route path="/"               element={<HomePage />} />
        <Route path="/packages"       element={<PackagesPage />} />
        <Route path="/packages/:id"   element={<PackageDetailPage />} />
        <Route path="/login"          element={<LoginPage />} />
        <Route path="/register"       element={<RegisterPage />} />

        {/* Protected */}
        <Route path="/booking/:id"    element={<PrivateRoute><BookingPage /></PrivateRoute>} />
        <Route path="/dashboard"      element={<PrivateRoute><DashboardPage /></PrivateRoute>} />

        {/* Admin only */}
        <Route path="/admin"          element={<AdminRoute><AdminPage /></AdminRoute>} />

        <Route path="*"               element={<NotFoundPage />} />
      </Routes>
    </main>
    <Footer />

    <ToastContainer
      position="top-right"
      autoClose={3500}
      hideProgressBar={false}
      newestOnTop
      closeOnClick
      pauseOnHover
      theme="light"
      toastStyle={{ fontFamily: 'DM Sans, sans-serif' }}
    />
  </>
);

const App = () => (
  <BrowserRouter>
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  </BrowserRouter>
);

export default App;

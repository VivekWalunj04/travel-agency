import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';

// ─────────────────────────────────────────────────────────────────────────────
// LOGIN PAGE
// ─────────────────────────────────────────────────────────────────────────────
export const LoginPage = () => {
  const { login }  = useAuth();
  const navigate   = useNavigate();
  const [params]   = useSearchParams();

  const [form, setForm]       = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState('');

  const handleChange = e =>
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    if (!form.email || !form.password) { setError('Please fill in all fields'); return; }

    setLoading(true);
    try {
      await login(form.email, form.password);
      toast.success('Welcome back! 👋');
      navigate(params.get('redirect') || '/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return <AuthLayout title="Welcome Back" subtitle="Sign in to your Wanderlust account">
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {error && <div className="alert alert-error">{error}</div>}

      <div className="form-group">
        <label className="form-label">Email Address</label>
        <input type="email" name="email" value={form.email} onChange={handleChange}
          className="form-input" placeholder="you@example.com" autoComplete="email" />
      </div>

      <div className="form-group">
        <label className="form-label">Password</label>
        <input type="password" name="password" value={form.password} onChange={handleChange}
          className="form-input" placeholder="••••••••" autoComplete="current-password" />
      </div>

      <button type="submit" disabled={loading} className="btn btn-primary"
        style={{ width: '100%', justifyContent: 'center', padding: '14px', fontSize: '1rem', marginTop: 4 }}>
        {loading ? 'Signing in...' : 'Sign In'}
      </button>

      <p style={{ textAlign: 'center', fontSize: '.875rem', color: 'var(--mid-gray)' }}>
        Don't have an account?{' '}
        <Link to="/register" style={{ color: 'var(--amber)', fontWeight: 600 }}>Create one free →</Link>
      </p>

      {/* Demo credentials */}
      <div style={{
        background: 'var(--sand)', borderRadius: 'var(--r-md)', padding: '14px 16px',
        fontSize: '.8rem', color: 'var(--mid-gray)',
      }}>
        <p style={{ fontWeight: 700, marginBottom: 6, color: 'var(--charcoal-mid)' }}>🔑 Demo Credentials</p>
        <p>Admin: admin@travelagency.com / admin123456</p>
        <p>User:  jane@example.com / user123456</p>
      </div>
    </form>
  </AuthLayout>;
};

// ─────────────────────────────────────────────────────────────────────────────
// REGISTER PAGE
// ─────────────────────────────────────────────────────────────────────────────
export const RegisterPage = () => {
  const { register } = useAuth();
  const navigate      = useNavigate();

  const [form, setForm]       = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);
  const [errors,  setErrors]  = useState({});

  const handleChange = e => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    if (errors[e.target.name]) setErrors(prev => ({ ...prev, [e.target.name]: '' }));
  };

  const validate = () => {
    const e = {};
    if (!form.name || form.name.length < 2)          e.name            = 'Name must be at least 2 characters';
    if (!form.email || !/\S+@\S+\.\S+/.test(form.email)) e.email       = 'Please enter a valid email';
    if (!form.password || form.password.length < 6)  e.password        = 'Password must be at least 6 characters';
    if (form.password !== form.confirmPassword)       e.confirmPassword = 'Passwords do not match';
    return e;
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length) { setErrors(validationErrors); return; }

    setLoading(true);
    try {
      await register(form.name, form.email, form.password);
      toast.success('Account created! Welcome to Wanderlust 🎉');
      navigate('/');
    } catch (err) {
      setErrors({ general: err.response?.data?.message || 'Registration failed. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return <AuthLayout title="Create Account" subtitle="Join 50,000+ travellers on Wanderlust">
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      {errors.general && <div className="alert alert-error">{errors.general}</div>}

      {[
        { name: 'name',            label: 'Full Name',        type: 'text',     placeholder: 'Jane Traveller' },
        { name: 'email',           label: 'Email Address',    type: 'email',    placeholder: 'you@example.com' },
        { name: 'password',        label: 'Password',         type: 'password', placeholder: 'Min 6 characters' },
        { name: 'confirmPassword', label: 'Confirm Password', type: 'password', placeholder: 'Repeat password' },
      ].map(({ name, label, type, placeholder }) => (
        <div key={name} className="form-group">
          <label className="form-label">{label}</label>
          <input type={type} name={name} value={form[name]} onChange={handleChange}
            className="form-input" placeholder={placeholder}
            style={errors[name] ? { borderColor: 'var(--red)' } : {}}
          />
          {errors[name] && <span className="form-error">{errors[name]}</span>}
        </div>
      ))}

      <button type="submit" disabled={loading} className="btn btn-primary"
        style={{ width: '100%', justifyContent: 'center', padding: '14px', fontSize: '1rem', marginTop: 4 }}>
        {loading ? 'Creating account...' : 'Create Account'}
      </button>

      <p style={{ textAlign: 'center', fontSize: '.875rem', color: 'var(--mid-gray)' }}>
        Already have an account?{' '}
        <Link to="/login" style={{ color: 'var(--amber)', fontWeight: 600 }}>Sign in →</Link>
      </p>
    </form>
  </AuthLayout>;
};

// ─────────────────────────────────────────────────────────────────────────────
// SHARED AUTH LAYOUT
// ─────────────────────────────────────────────────────────────────────────────
const AuthLayout = ({ title, subtitle, children }) => (
  <div style={{
    minHeight: '100vh', paddingTop: 'var(--nav-h)',
    background: 'var(--sand)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    padding: 'calc(var(--nav-h) + 40px) 16px 60px',
  }}>
    <div style={{ width: '100%', maxWidth: 440 }}>
      <div style={{ textAlign: 'center', marginBottom: 32 }}>
        <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 24 }}>
          <span style={{ fontSize: '2rem' }}>✈</span>
          <span style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.5rem', fontWeight: 700 }}>Wanderlust</span>
        </Link>
        <h2 style={{ fontSize: '1.75rem', marginBottom: 8 }}>{title}</h2>
        <p style={{ color: 'var(--mid-gray)', fontSize: '.9rem' }}>{subtitle}</p>
      </div>

      <div style={{
        background: 'var(--white)', borderRadius: 'var(--r-lg)',
        padding: '36px', boxShadow: 'var(--shadow-md)',
        border: '1px solid var(--sand-dark)',
      }}>
        {children}
      </div>
    </div>
  </div>
);

export default LoginPage;

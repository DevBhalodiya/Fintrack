import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import InputField from '../components/InputField';
import Button from '../components/Button';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [showResend, setShowResend] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const { loginUser, resendVerificationEmail } = useContext(AuthContext);
  const navigate = useNavigate();

  // Validation logic
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      return 'Email is required';
    }
    if (!emailRegex.test(email)) {
      return 'Please enter a valid email address';
    }
    return '';
  };

  const validatePassword = (password) => {
    if (!password) {
      return 'Password is required';
    }
    if (password.length < 6) {
      return 'Password must be at least 6 characters';
    }
    return '';
  };

  const validateForm = () => {
    const newErrors = {};

    const emailError = validateEmail(formData.email);
    if (emailError) newErrors.email = emailError;

    const passwordError = validatePassword(formData.password);
    if (passwordError) newErrors.password = passwordError;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError('');
    setSuccessMessage('');
    setShowResend(false);

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // Call Firebase loginUser service
      await loginUser(formData.email, formData.password);

      setSuccessMessage('Login successful! Redirecting...');
      setTimeout(() => {
        navigate('/dashboard');
      }, 500);
    } catch (err) {
      console.error('Login error:', err);
      let errorMessage = 'Login failed. Please try again.';
      if (err.code === 'auth/email-not-verified') {
        errorMessage = err.message;
        setShowResend(true);
      } else if (
        err.code === 'auth/wrong-password' ||
        err.code === 'auth/user-not-found' ||
        err.code === 'auth/invalid-credential'
      ) {
        errorMessage = 'Invalid email or password.';
      } else if (err.code === 'auth/network-request-failed') {
        errorMessage = 'Network error. Please check your internet connection.';
      } else if (err.message) {
        errorMessage = err.message;
      }
      setApiError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleResendVerification = async () => {
    setResendLoading(true);
    setApiError('');
    setSuccessMessage('');
    try {
      await resendVerificationEmail(formData.email, formData.password);
      setSuccessMessage('Verification email resent! Please check your inbox.');
      setShowResend(false);
    } catch (err) {
      console.error('Resend verification error:', err);
      let errMsg = 'Failed to resend verification email.';
      if (err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        errMsg = 'Invalid password for resending verification.';
      } else if (err.message) {
        errMsg = err.message;
      }
      setApiError(errMsg);
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4 py-8 relative overflow-hidden">
      {/* Dynamic Background Glowing Accents */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl animate-pulse pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl animate-pulse pointer-events-none" style={{ animationDelay: '2s' }} />

      {/* Login Card */}
      <div className="backdrop-blur-md bg-slate-900/40 border border-slate-900 rounded-3xl shadow-2xl p-8 w-full max-w-md relative z-10">
        
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-gradient-to-tr from-indigo-600 to-violet-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-indigo-500/20 animate-float">
            <span className="text-white text-2xl font-black">₹</span>
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">FinTrack</h1>
          <p className="text-slate-400 mt-2 text-sm">Sign in to manage your budget</p>
        </div>

        {/* API Error Message */}
        {apiError && (
          <div className="mb-6 p-4 bg-rose-955/20 border-l-4 border-rose-500 text-rose-300 rounded-xl backdrop-blur-sm">
            <div className="flex items-start text-sm">
              <span className="mr-2.5 font-bold">⚠</span>
              <span>{apiError}</span>
            </div>
            {showResend && (
              <div className="mt-3 pt-2 border-t border-rose-500/20 text-center">
                <button
                  type="button"
                  onClick={handleResendVerification}
                  disabled={resendLoading}
                  className="text-xs text-indigo-400 hover:text-indigo-300 font-bold underline transition-colors cursor-pointer disabled:opacity-50"
                >
                  {resendLoading ? 'Resending verification email...' : 'Resend verification email'}
                </button>
              </div>
            )}
          </div>
        )}

        {/* Success Message */}
        {successMessage && (
          <div className="mb-6 p-4 bg-emerald-955/20 border-l-4 border-emerald-500 text-emerald-300 rounded-xl flex items-start text-sm backdrop-blur-sm">
            <span className="mr-2.5 font-bold">✓</span>
            <span>{successMessage}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <InputField
            label="Email Address"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
            placeholder="you@example.com"
            required
            autoComplete="email"
          />

          <InputField
            label="Password"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            error={errors.password}
            placeholder="••••••••"
            required
            autoComplete="current-password"
          />

          <Button
            type="submit"
            text="Login"
            loading={loading}
            variant="primary"
            fullWidth
          />
        </form>

        {/* Register Link */}
        <p className="text-center text-slate-400 mt-8 text-sm">
          Don't have an account?{' '}
          <Link to="/register" className="text-indigo-400 font-semibold hover:text-indigo-300 transition-colors hover:underline">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;

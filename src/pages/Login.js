import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import InputField from '../components/InputField';
import Button from '../components/Button';
import api from '../utils/api';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const { login } = useContext(AuthContext);
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

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // Call the actual backend API
      const response = await api.post('/auth/login', {
        email: formData.email,
        password: formData.password,
      });

      if (response.data.success) {
        const { token, user } = response.data.data;
        
        // Save to localStorage
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        
        // Update auth context
        login(user, token);
        
        setSuccessMessage('Login successful! Redirecting...');
        setTimeout(() => {
          navigate('/dashboard');
        }, 500);
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Login failed. Please try again.';
      setApiError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = () => {
    // Show notification that user should register/login with real credentials
    alert('Please register first or login with your credentials. The demo feature is disabled as the app now uses real backend.');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center px-4 py-8">
      <div className="bg-white rounded-lg shadow-2xl p-8 w-full max-w-md">
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-white text-3xl font-bold">₹</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-800">FinTrack</h1>
          <p className="text-gray-500 mt-2">Personal Finance Tracker</p>
        </div>

        {/* API Error Message */}
        {apiError && (
          <div className="mb-4 p-3 bg-red-100 border-l-4 border-red-500 text-red-700 rounded flex items-start">
            <span className="mr-2">⚠</span>
            <span>{apiError}</span>
          </div>
        )}

        {/* Success Message */}
        {successMessage && (
          <div className="mb-4 p-3 bg-green-100 border-l-4 border-green-500 text-green-700 rounded flex items-start">
            <span className="mr-2">✓</span>
            <span>{successMessage}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
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

          {/* Divider */}
          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">or</span>
            </div>
          </div>

          {/* Demo Button */}
          <Button
            type="button"
            text="Demo Login (Test Dashboard)"
            onClick={handleDemoLogin}
            variant="success"
            fullWidth
          />
        </form>

        {/* Register Link */}
        <p className="text-center text-gray-600 mt-6">
          Don't have an account?{' '}
          <Link to="/register" className="text-blue-600 font-semibold hover:underline">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
};

// Mock login function (replace with actual API call in production)

export default Login;

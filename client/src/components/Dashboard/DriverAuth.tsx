import React, { useState } from 'react';
import { Lock, Mail, Loader2 } from 'lucide-react';

interface Props {
  onAuth: (driver: any) => void;
  language?: 'en' | 'sw';
}

const labels = {
  en: {
    title: 'Driver Login',
    email: 'Email Address',
    password: 'Password',
    login: 'Login',
    loggingIn: 'Logging in...',
    invalidCredentials: 'Invalid email or password',
    emailRequired: 'Email is required',
    passwordRequired: 'Password is required',
  },
  sw: {
    title: 'Ingia Kwa Dereva',
    email: 'Barua Pepe',
    password: 'Nenosiri',
    login: 'Ingia',
    loggingIn: 'Inaingia...',
    invalidCredentials: 'Barua pepe au nenosiri si sahihi',
    emailRequired: 'Barua pepe inahitajika',
    passwordRequired: 'Nenosiri linahitajika',
  },
};

const DriverAuth: React.FC<Props> = ({ onAuth, language = 'en' }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const validateForm = () => {
    let isValid = true;
    setEmailError('');
    setPasswordError('');
    
    if (!email.trim()) {
      setEmailError(labels[language].emailRequired);
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError('Please enter a valid email address');
      isValid = false;
    }
    
    if (!password) {
      setPasswordError(labels[language].passwordRequired);
      isValid = false;
    } else if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      isValid = false;
    }
    
    return isValid;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    setError('');
    
    // TODO: Replace with real API call
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (email === 'driver@example.com' && password === 'password') {
        onAuth({ name: 'Driver', email });
      } else {
        setError(labels[language].invalidCredentials);
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto mt-8 md:mt-16">
      <div className="bg-theme-surface rounded-xl shadow-lg overflow-hidden border border-theme-border/50">
        <div className="p-2 bg-gradient-to-r from-primary/10 to-primary-dark/10 border-b border-theme-border/30">
          <h2 className="text-2xl font-bold text-center text-theme-text py-3">
            {labels[language].title}
          </h2>
        </div>
        
        <div className="p-6 sm:p-8">
          {error && (
            <div className="mb-6 p-3 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-300 rounded-lg text-sm flex items-start">
              <svg className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{error}</span>
            </div>
          )}
          
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-theme-text-muted mb-1.5">
                {labels[language].email}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-theme-text-muted" />
                </div>
                <input
                  id="email"
                  type="email"
                  className={`block w-full pl-10 pr-3 py-2.5 rounded-lg border ${
                    emailError 
                      ? 'border-red-500 focus:ring-red-500 focus:border-red-500' 
                      : 'border-theme-border/50 focus:ring-primary/50 focus:border-primary'
                  } bg-theme-surface-muted text-theme-text placeholder-theme-text-muted/60 shadow-sm focus:outline-none focus:ring-2 transition-colors duration-200`}
                  placeholder="you@example.com"
                  value={email}
                  onChange={e => {
                    setEmail(e.target.value);
                    if (emailError) setEmailError('');
                  }}
                  disabled={loading}
                />
              </div>
              {emailError && <p className="mt-1.5 text-sm text-red-500">{emailError}</p>}
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label htmlFor="password" className="block text-sm font-medium text-theme-text-muted">
                  {labels[language].password}
                </label>
                <a href="#forgot-password" className="text-xs text-primary hover:text-primary-dark transition-colors">
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-theme-text-muted" />
                </div>
                <input
                  id="password"
                  type="password"
                  className={`block w-full pl-10 pr-3 py-2.5 rounded-lg border ${
                    passwordError 
                      ? 'border-red-500 focus:ring-red-500 focus:border-red-500' 
                      : 'border-theme-border/50 focus:ring-primary/50 focus:border-primary'
                  } bg-theme-surface-muted text-theme-text placeholder-theme-text-muted/60 shadow-sm focus:outline-none focus:ring-2 transition-colors duration-200`}
                  placeholder="••••••••"
                  value={password}
                  onChange={e => {
                    setPassword(e.target.value);
                    if (passwordError) setPasswordError('');
                  }}
                  disabled={loading}
                />
              </div>
              {passwordError && <p className="mt-1.5 text-sm text-red-500">{passwordError}</p>}
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center items-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-primary to-primary-dark hover:from-primary/90 hover:to-primary-dark/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary/50 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" />
                  {labels[language].loggingIn}
                </>
              ) : (
                labels[language].login
              )}
            </button>
          </form>
          
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-theme-border/50"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-theme-surface text-theme-text-muted">
                  Don't have an account?
                </span>
              </div>
            </div>
            
            <div className="mt-6 grid grid-cols-1 gap-3">
              <a
                href="#register"
                className="w-full flex items-center justify-center px-4 py-2 border border-theme-border/50 rounded-lg shadow-sm text-sm font-medium text-theme-text bg-theme-surface hover:bg-theme-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary/50 transition-colors duration-200"
              >
                Create new account
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DriverAuth;
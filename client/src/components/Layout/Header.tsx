import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Bus, User, LogOut, Menu, Sun, Moon } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { useLanguage } from '../../contexts/LanguageContext';

const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="bg-gradient-to-r from-blue-500 to-blue-400 dark:from-gray-900 dark:to-gray-800 shadow-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 py-3">
          {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <Bus className="h-8 w-8 text-white dark:text-gray-100" />
          <span className="font-bold text-xl text-white dark:text-gray-100">SafariTrack</span>
          </Link>
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <NavLink to="/routes" className={() => 'px-2 py-1 rounded-lg font-medium transition focus:outline-none focus:ring-2 focus:ring-blue-300 text-blue-900 dark:text-blue-400'}>{t('routes')}</NavLink>
          <NavLink to="/schedules" className={() => 'px-2 py-1 rounded-lg font-medium transition focus:outline-none focus:ring-2 focus:ring-blue-300 text-blue-900 dark:text-blue-400'}>{t('schedules')}</NavLink>
          {user?.role === 'driver' && (
            <NavLink to="/dashboard" className={() => 'px-2 py-1 rounded-lg font-medium transition focus:outline-none focus:ring-2 focus:ring-blue-300 text-blue-900 dark:text-blue-400'}>{t('dashboard')}</NavLink>
          )}
        </nav>
        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <User className="h-5 w-5 text-white dark:text-gray-200" />
                <span className="text-sm font-medium text-white dark:text-gray-200">{user.name}</span>
                <span className="text-xs px-2 py-1 rounded-full bg-white/20 text-white dark:text-gray-200">{user.role}</span>
              </div>
              <button onClick={handleLogout} className="flex items-center gap-1 hover:text-blue-200 dark:hover:text-blue-400 transition-colors text-white dark:text-gray-200 text-sm">
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link to="/login" className="text-white dark:text-gray-200 hover:underline font-medium px-2 py-1 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300">{t('login')}</Link>
              <Link to="/register" className="bg-gradient-to-r from-blue-600 to-purple-500 hover:from-blue-700 hover:to-purple-600 text-white font-semibold px-4 py-2 rounded-lg shadow transition focus:outline-none focus:ring-2 focus:ring-blue-300">{t('register')}</Link>
            </div>
          )}
          <select value={language} onChange={e => setLanguage(e.target.value as 'en' | 'sw')} className="bg-white/20 dark:bg-gray-700 text-white dark:text-gray-200 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-300" aria-label="Language toggle">
            <option value="en">English</option>
            <option value="sw">Kiswahili</option>
          </select>
          <button onClick={toggleTheme} className="ml-2 p-2 rounded-full bg-white/20 dark:bg-gray-700 hover:bg-white/30 dark:hover:bg-gray-600 transition focus:outline-none focus:ring-2 focus:ring-blue-300" aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}>
            {theme === 'dark' ? <Sun className="h-5 w-5 text-white" /> : <Moon className="h-5 w-5 text-white" />}
          </button>
        </div>
        {/* Mobile menu button */}
        <div className="md:hidden flex items-center">
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-white focus:outline-none" aria-label="Toggle menu">
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </div>
      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-gradient-to-r from-blue-500 to-blue-400 dark:from-gray-900 dark:to-gray-800 px-4 pt-2 pb-4 space-y-2 shadow-lg z-50">
          <nav className="flex flex-col gap-2">
            <NavLink to="/routes" className={() => 'block px-3 py-2 rounded-lg font-medium text-base text-white dark:text-blue-400'} onClick={() => setMobileMenuOpen(false)}>{t('routes')}</NavLink>
            <NavLink to="/schedules" className={() => 'block px-3 py-2 rounded-lg font-medium text-base text-white dark:text-blue-400'} onClick={() => setMobileMenuOpen(false)}>{t('schedules')}</NavLink>
            {user?.role === 'driver' && (
              <NavLink to="/dashboard" className={() => 'block px-3 py-2 rounded-lg font-medium text-base text-white dark:text-blue-400'} onClick={() => setMobileMenuOpen(false)}>{t('dashboard')}</NavLink>
            )}
          </nav>
          <div className="flex flex-col gap-2 mt-3">
            {user ? (
              <button onClick={() => { handleLogout(); setMobileMenuOpen(false); }} className="flex items-center gap-2 text-white dark:text-gray-200 px-3 py-2 rounded-lg font-medium">
                <LogOut className="h-4 w-4" /> Logout
                </button>
            ) : (
              <>
                <Link to="/login" className="text-white dark:text-gray-200 px-3 py-2 rounded-lg font-medium" onClick={() => setMobileMenuOpen(false)}>{t('login')}</Link>
                <Link to="/register" className="bg-gradient-to-r from-blue-600 to-purple-500 text-white font-semibold px-3 py-2 rounded-lg shadow" onClick={() => setMobileMenuOpen(false)}>{t('register')}</Link>
              </>
            )}
            <select value={language} onChange={e => setLanguage(e.target.value as 'en' | 'sw')} className="bg-white/20 dark:bg-gray-700 text-white dark:text-gray-200 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-300 mt-2" aria-label="Language toggle">
              <option value="en">English</option>
              <option value="sw">Kiswahili</option>
            </select>
            <button onClick={toggleTheme} className="p-2 rounded-full bg-white/20 dark:bg-gray-700 hover:bg-white/30 dark:hover:bg-gray-600 transition focus:outline-none focus:ring-2 focus:ring-blue-300 mt-2" aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}>
              {theme === 'dark' ? <Sun className="h-5 w-5 text-white" /> : <Moon className="h-5 w-5 text-white" />}
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
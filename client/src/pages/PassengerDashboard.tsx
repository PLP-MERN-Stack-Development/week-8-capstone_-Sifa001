import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import RouteSearch from '../components/Dashboard/RouteSearch';
import DepartureBoard from '../components/Dashboard/DepartureBoard';
import FavoriteRoutes from '../components/Dashboard/FavoriteRoutes';
import UserProfile from '../components/Dashboard/UserProfile';
import NotificationSettings from '../components/Dashboard/NotificationSettings';

const LANGUAGES = {
  en: 'English',
  sw: 'Swahili',
};

const PassengerDashboard: React.FC = () => {
  const { user } = useAuth();
  const [language, setLanguage] = useState<'en' | 'sw'>('en');
  const [error, setError] = useState<string>('');
  const [selectedRoute, setSelectedRoute] = useState<any>(null);
  const [favoriteRoutes, setFavoriteRoutes] = useState<any[]>([]);
  const [recentSearches, setRecentSearches] = useState<any[]>([]);
  const [offlineRoutes, setOfflineRoutes] = useState<any[]>([]);

  // Error boundary for dashboard
  const handleError = (msg: string) => setError(msg);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center md:justify-between px-4 sm:px-6 lg:px-8 py-4 bg-gray-800 shadow-md gap-4 w-full">
        <div>
          <h1 className="text-2xl font-bold text-white">
            {user ? `Welcome back, ${user.name.split(' ')[0]}!` : 'Welcome!'}
          </h1>
          <p className="text-gray-400 text-sm mt-1">Your personalized dashboard</p>
        </div>
        <div className="flex items-center gap-4">
          <select
            value={language}
            onChange={e => setLanguage(e.target.value as 'en' | 'sw')}
            className="bg-gray-700 text-white rounded px-2 py-1"
            aria-label="Language toggle"
          >
            {Object.entries(LANGUAGES).map(([key, label]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>
          <UserProfile language={language} />
        </div>
      </header>
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {error && (
          <div className="bg-red-900 border border-red-700 rounded-md p-4 mb-4">
            <p className="text-red-200">{error}</p>
          </div>
        )}
        {/* Top grid: Favorites, Recent, Upcoming */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
          <FavoriteRoutes
            favoriteRoutes={favoriteRoutes}
            onSelectRoute={setSelectedRoute}
            onError={handleError}
            language={language}
            onRemove={routeId => setFavoriteRoutes(favoriteRoutes.filter(r => r._id !== routeId))}
          />
          <div className="bg-gray-800 rounded-lg p-4 flex flex-col w-full">
            <h2 className="text-lg font-semibold mb-2">Recent Searches</h2>
            <ul className="space-y-1 flex-1">
              {recentSearches.length === 0 ? (
                <li className="text-gray-400 text-sm">No recent searches.</li>
              ) : (
                recentSearches.map((search, idx) => (
                  <li key={idx} className="text-gray-200 cursor-pointer hover:underline" onClick={() => setSelectedRoute(search.route)}>
                    {search.route?.routeName || (search.route?.startLocation?.name + ' → ' + search.route?.endLocation?.name)}
                  </li>
                ))
              )}
            </ul>
          </div>
          <div className="bg-gray-800 rounded-lg p-4 flex flex-col items-start justify-between w-full">
            <h2 className="text-lg font-semibold mb-2">Upcoming Trips</h2>
            <div className="text-gray-400 text-sm flex-1">No upcoming trips. Book a route to see it here!</div>
            {/* Add real upcoming trips here in the future */}
          </div>
        </div>
        {/* Middle grid: Search & Board */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
          <div className="bg-gray-800 rounded-lg p-4 w-full">
            <RouteSearch
              onSelectRoute={setSelectedRoute}
              onError={handleError}
              language={language}
              onRecentSearch={search => setRecentSearches([search, ...recentSearches.slice(0, 4)])}
            />
          </div>
          <div className="bg-gray-800 rounded-lg p-4 w-full">
            <DepartureBoard
              selectedRoute={selectedRoute}
              onError={handleError}
              language={language}
            />
          </div>
        </div>
        {/* Bottom grid: Notifications, Profile/Settings, Offline */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
          <div className="bg-gray-800 rounded-lg p-4 w-full">
            <NotificationSettings language={language} />
          </div>
          <div className="bg-gray-800 rounded-lg p-4 w-full">
            <h2 className="text-lg font-semibold mb-2">Profile & Settings</h2>
            <UserProfile language={language} />
            {/* Add more settings/actions here if needed */}
          </div>
          <div className="bg-gray-800 rounded-lg p-4 w-full">
            <h2 className="text-lg font-semibold mb-2">Offline Mode</h2>
            <p className="text-gray-400 text-sm mb-2">Access your saved routes even when offline.</p>
            <ul className="space-y-1">
              {offlineRoutes.length === 0 ? (
                <li className="text-gray-400 text-sm">No saved routes.</li>
              ) : (
                offlineRoutes.map((route, idx) => (
                  <li key={idx} className="text-gray-200">{route.routeName}</li>
                ))
              )}
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PassengerDashboard; 
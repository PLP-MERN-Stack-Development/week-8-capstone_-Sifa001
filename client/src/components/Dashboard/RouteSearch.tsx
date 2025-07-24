import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { MapPin, Search, Loader2, LocateFixed } from 'lucide-react';

interface Props {
  onSelectRoute: (route: any) => void;
  onError: (msg: string) => void;
  language: 'en' | 'sw';
  onRecentSearch: (search: any) => void;
}

const labels = {
  en: {
    from: 'From',
    to: 'To',
    search: 'Search',
    nearby: 'Use my location',
    select: 'Select a stage',
    error: 'Failed to fetch stages',
  },
  sw: {
    from: 'Kutoka',
    to: 'Hadi',
    search: 'Tafuta',
    nearby: 'Tumia eneo langu',
    select: 'Chagua kituo',
    error: 'Imeshindwa kupata vituo',
  },
};

const RouteSearch: React.FC<Props> = ({ onSelectRoute, onError, language, onRecentSearch }) => {
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [stages, setStages] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchStages();
  }, []);

  const fetchStages = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/api/stages');
      setStages(res.data.data);
    } catch (e) {
      setError(labels[language].error);
      onError(labels[language].error);
    } finally {
      setLoading(false);
    }
  };

  const handleNearby = () => {
    if (!navigator.geolocation) {
      setError('Geolocation not supported');
      onError('Geolocation not supported');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          setLoading(true);
          const { latitude, longitude } = pos.coords;
          const res = await axios.get(`/api/stages/nearby?lat=${latitude}&lng=${longitude}`);
          if (res.data.data.stages.length > 0) {
            setFrom(res.data.data.stages[0]._id);
          }
        } catch (e) {
          setError(labels[language].error);
          onError(labels[language].error);
        } finally {
          setLoading(false);
        }
      },
      () => {
        setError('Failed to get location');
        onError('Failed to get location');
      }
    );
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!from || !to) return;
    try {
      setSearching(true);
      const res = await axios.get(`/api/routes/search?from=${from}&to=${to}`);
      const route = res.data.data.route;
      onSelectRoute(route);
      onRecentSearch({ route });
    } catch (e) {
      setError('No route found');
      onError('No route found');
    } finally {
      setSearching(false);
    }
  };

  return (
    <section className="bg-theme-surface rounded-xl shadow-md border border-theme-border/50 p-4 sm:p-6 mb-6 transition-colors duration-200 w-full">
      <h2 className="text-xl font-semibold text-theme-text mb-4 flex items-center">
        <MapPin className="w-5 h-5 mr-2 text-primary" />
        {language === 'en' ? 'Find Your Route' : 'Tafuta Njia Yako'}
      </h2>

      <form onSubmit={handleSearch} className="space-y-4 w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
          <div className="relative w-full">
            <label htmlFor="from" className="block text-sm font-medium text-theme-text-muted mb-1">
              {labels[language].from}
            </label>
            <div className="relative">
              <select
                id="from"
                value={from}
                onChange={e => {
                  setFrom(e.target.value);
                  setError('');
                }}
                className={`block w-full pl-3 pr-10 py-2.5 rounded-lg border ${
                  error && !from ? 'border-red-500' : 'border-theme-border/50'
                } bg-theme-surface-muted text-theme-text shadow-sm focus:ring-2 focus:ring-offset-2 focus:ring-primary/50 focus:border-primary transition-colors duration-200`}
                disabled={loading}
              >
                <option value="">{labels[language].select}</option>
                {Array.isArray(stages) && stages.map(stage => (
                  <option key={stage._id} value={stage._id}>
                    {stage.name}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <MapPin className="h-4 w-4 text-theme-text-muted" />
              </div>
            </div>
            <button
              type="button"
              onClick={handleNearby}
              disabled={loading}
              className="mt-1.5 text-xs inline-flex items-center text-primary hover:text-primary-dark transition-colors duration-200 disabled:opacity-50"
            >
              <LocateFixed className="w-3 h-3 mr-1" />
              {labels[language].nearby}
            </button>
          </div>

          <div className="w-full">
            <label htmlFor="to" className="block text-sm font-medium text-theme-text-muted mb-1">
              {labels[language].to}
            </label>
            <div className="relative">
              <select
                id="to"
                value={to}
                onChange={e => {
                  setTo(e.target.value);
                  setError('');
                }}
                className={`block w-full pl-3 pr-10 py-2.5 rounded-lg border ${
                  error && !to ? 'border-red-500' : 'border-theme-border/50'
                } bg-theme-surface-muted text-theme-text shadow-sm focus:ring-2 focus:ring-offset-2 focus:ring-primary/50 focus:border-primary transition-colors duration-200`}
                disabled={loading}
              >
                <option value="">{labels[language].select}</option>
                {Array.isArray(stages) && stages
                  .filter(stage => stage._id !== from)
                  .map(stage => (
                    <option key={stage._id} value={stage._id}>
                      {stage.name}
                    </option>
                  ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <MapPin className="h-4 w-4 text-theme-text-muted" />
              </div>
            </div>
          </div>
        </div>

        <div className="pt-2 w-full">
          <button
            type="submit"
            disabled={searching || loading || !from || !to}
            className="w-full flex justify-center items-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-primary to-primary-dark hover:from-primary/90 hover:to-primary-dark/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary/50 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {searching ? (
              <>
                <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" />
                {language === 'en' ? 'Searching...' : 'Inatafuta...'}
              </>
            ) : (
              <>
                <Search className="-ml-1 mr-2 h-4 w-4" />
                {labels[language].search}
              </>
            )}
          </button>
        </div>
      </form>

      {error && (
        <div className="mt-3 p-3 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-300 rounded-lg text-sm flex items-start">
          <svg className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{error}</span>
        </div>
      )}
    </section>
  );
};

export default RouteSearch;
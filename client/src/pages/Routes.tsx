import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, MapPin, Clock, DollarSign, Bus, ArrowRight, AlertCircle, Loader2, RefreshCw, XCircle } from 'lucide-react';
import axios from 'axios';
import { useTheme } from '../contexts/ThemeContext';

interface Route {
  _id: string;
  routeName: string;
  startLocation: {
    name: string;
    coordinates: [number, number];
  };
  endLocation: {
    name: string;
    coordinates: [number, number];
  };
  distance: number;
  estimatedDuration: number;
  fare: number;
  isActive: boolean;
  stops?: Array<{
    name: string;
    coordinates: [number, number];
    order: number;
  }>;
  schedule?: Array<{
    departureTime: string;
    arrivalTime: string;
    days: string[];
  }>;
  createdAt: string;
  updatedAt: string;
}

const Routes: React.FC = () => {
  const [routes, setRoutes] = useState<Route[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [startLocation, setStartLocation] = useState('');
  const [endLocation, setEndLocation] = useState('');

  const { theme } = useTheme();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedRoute, setSelectedRoute] = useState<Route | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    minFare: '',
    maxFare: '',
    maxDuration: '',
    activeOnly: true
  });

  useEffect(() => {
    fetchRoutes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm, startLocation, endLocation, filters]);

  const fetchRoutes = async (showLoading = true) => {
    try {
      if (showLoading) {
        setLoading(true);
      } else {
        setIsRefreshing(true);
      }
      
      const params = new URLSearchParams();
      if (searchTerm) params.append('search', searchTerm);
      if (startLocation) params.append('startLocation', startLocation);
      if (endLocation) params.append('endLocation', endLocation);
      if (filters.minFare) params.append('minFare', filters.minFare);
      if (filters.maxFare) params.append('maxFare', filters.maxFare);
      if (filters.maxDuration) params.append('maxDuration', filters.maxDuration);
      if (filters.activeOnly) params.append('isActive', 'true');

      const response = await axios.get(`/api/routes?${params.toString()}`);
      setRoutes(response.data.data.routes);
      setError('');
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to fetch routes';
      setError(errorMessage);
      console.error('Error fetching routes:', err);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  const handleRefresh = () => {
    fetchRoutes(false);
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const resetFilters = () => {
    setFilters({
      minFare: '',
      maxFare: '',
      maxDuration: '',
      activeOnly: true
    });
    setStartLocation('');
    setEndLocation('');
    setSearchTerm('');
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchRoutes();
  };

  return (
    <div className={`min-h-screen py-8 transition-colors duration-200 ${theme === 'dark' ? 'bg-theme-surface text-theme-text' : 'bg-gray-50 text-gray-900'}`}>
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-theme-text mb-3">
            Matatu Routes
          </h1>
          <p className="text-lg text-theme-text-muted">
            Find all available matatu routes across Nairobi
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-theme-surface border border-theme-border/50 rounded-xl shadow-sm p-6 mb-8 transition-colors duration-200">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
            <h2 className="text-lg font-medium text-theme-text mb-3 sm:mb-0">
              Search Routes
            </h2>
            <div className="flex space-x-3">
              <button
                type="button"
                onClick={() => setShowFilters(!showFilters)}
                className="inline-flex items-center px-3 py-1.5 border border-theme-border rounded-md text-sm font-medium text-theme-text-muted hover:bg-theme-surface-muted/50 transition-colors"
              >
                <svg className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
                {showFilters ? 'Hide Filters' : 'Show Filters'}
              </button>
              <button
                type="button"
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="inline-flex items-center px-3 py-1.5 border border-theme-border rounded-md text-sm font-medium text-theme-text-muted hover:bg-theme-surface-muted/50 transition-colors disabled:opacity-50"
              >
                {isRefreshing ? (
                  <Loader2 className="h-4 w-4 mr-1.5 animate-spin" />
                ) : (
                  <svg className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                )}
                Refresh
              </button>
            </div>
          </div>

          <form onSubmit={handleSearch} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="from" className="block text-sm font-medium text-theme-text-muted mb-1">
                  From
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-theme-text-muted" />
                  <input
                    type="text"
                    id="from"
                    value={startLocation}
                    onChange={(e) => setStartLocation(e.target.value)}
                    className="block w-full pl-9 pr-3 py-2 border border-theme-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary bg-theme-surface-muted/50 text-theme-text transition-colors"
                    placeholder="e.g., Kencom, CBD"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="to" className="block text-sm font-medium text-theme-text-muted mb-1">
                  To
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-theme-text-muted" />
                  <input
                    type="text"
                    id="to"
                    value={endLocation}
                    onChange={(e) => setEndLocation(e.target.value)}
                    className="block w-full pl-9 pr-3 py-2 border border-theme-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary bg-theme-surface-muted/50 text-theme-text transition-colors"
                    placeholder="e.g., Westlands, Kasarani"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="search" className="block text-sm font-medium text-theme-text-muted mb-1">
                  Search by name
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-theme-text-muted" />
                  <input
                    type="text"
                    id="search"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="block w-full pl-9 pr-3 py-2 border border-theme-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary bg-theme-surface-muted/50 text-theme-text transition-colors"
                    placeholder="Search routes..."
                  />
                </div>
              </div>
            </div>

            {/* Advanced Filters */}
            {showFilters && (
              <div className="pt-4 mt-4 border-t border-theme-border/50">
                <h3 className="text-sm font-medium text-theme-text mb-3">Advanced Filters</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <label htmlFor="minFare" className="block text-xs font-medium text-theme-text-muted mb-1">
                      Min Fare (KES)
                    </label>
                    <input
                      type="number"
                      id="minFare"
                      name="minFare"
                      value={filters.minFare}
                      onChange={handleFilterChange}
                      min="0"
                      className="block w-full px-3 py-2 border border-theme-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary bg-theme-surface-muted/50 text-theme-text transition-colors"
                      placeholder="Min"
                    />
                  </div>
                  <div>
                    <label htmlFor="maxFare" className="block text-xs font-medium text-theme-text-muted mb-1">
                      Max Fare (KES)
                    </label>
                    <input
                      type="number"
                      id="maxFare"
                      name="maxFare"
                      value={filters.maxFare}
                      onChange={handleFilterChange}
                      min={filters.minFare || '0'}
                      className="block w-full px-3 py-2 border border-theme-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary bg-theme-surface-muted/50 text-theme-text transition-colors"
                      placeholder="Max"
                    />
                  </div>
                  <div>
                    <label htmlFor="maxDuration" className="block text-xs font-medium text-theme-text-muted mb-1">
                      Max Duration (min)
                    </label>
                    <input
                      type="number"
                      id="maxDuration"
                      name="maxDuration"
                      value={filters.maxDuration}
                      onChange={handleFilterChange}
                      min="1"
                      className="block w-full px-3 py-2 border border-theme-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary bg-theme-surface-muted/50 text-theme-text transition-colors"
                      placeholder="e.g., 60"
                    />
                  </div>
                  <div className="flex items-end">
                    <div className="flex items-center h-10">
                      <input
                        id="activeOnly"
                        name="activeOnly"
                        type="checkbox"
                        checked={filters.activeOnly}
                        onChange={handleFilterChange}
                        className="h-4 w-4 text-primary focus:ring-primary border-theme-border rounded"
                      />
                      <label htmlFor="activeOnly" className="ml-2 block text-sm text-theme-text">
                        Active routes only
                      </label>
                    </div>
                  </div>
                </div>
                <div className="mt-4 flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={resetFilters}
                    className="px-3 py-1.5 text-sm font-medium text-theme-text-muted hover:text-theme-text transition-colors"
                  >
                    Reset Filters
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 bg-primary hover:bg-primary-dark text-white text-sm font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 transition-colors"
                  >
                    Apply Filters
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>

        {/* Results */}
        <div className="space-y-4">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
            <h2 className="text-lg font-medium text-theme-text mb-2 sm:mb-0">
              Available Routes
              {Array.isArray(routes) && routes.length > 0 && (
                <span className="ml-2 text-sm font-normal text-theme-text-muted">
                  ({routes.length} {routes.length === 1 ? 'route' : 'routes'} found)
                </span>
              )}
            </h2>
            {Array.isArray(routes) && routes.length > 0 && (
              <div className="text-sm text-theme-text-muted">
                <span className="inline-flex items-center">
                  <span className="w-2 h-2 rounded-full bg-green-500 mr-1.5"></span>
                  Active
                </span>
                <span className="mx-2 text-theme-border">•</span>
                <span className="inline-flex items-center">
                  <span className="w-2 h-2 rounded-full bg-gray-400 mr-1.5"></span>
                  Inactive
                </span>
              </div>
            )}
          </div>

          {/* Loading State */}
          {loading ? (
            <div className="bg-theme-surface border border-theme-border/50 rounded-xl p-8 text-center">
              <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-theme-surface-muted/50 text-primary">
                <Loader2 className="h-6 w-6 animate-spin" />
              </div>
              <h3 className="mt-3 text-base font-medium text-theme-text">Loading routes...</h3>
              <p className="mt-1 text-sm text-theme-text-muted">Please wait while we fetch the latest routes</p>
            </div>
          ) : error ? (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/30 rounded-xl p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <AlertCircle className="h-5 w-5 text-red-500 dark:text-red-400" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800 dark:text-red-200">Error loading routes</h3>
                  <div className="mt-2 text-sm text-red-700 dark:text-red-300">
                    <p>{error}</p>
                  </div>
                  <div className="mt-4">
                    <button
                      type="button"
                      onClick={() => fetchRoutes()}
                      className="inline-flex items-center text-sm font-medium text-red-700 dark:text-red-300 hover:text-red-600 dark:hover:text-red-200 focus:outline-none"
                    >
                      <RefreshCw className="h-4 w-4 mr-1.5" />
                      Try again
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (Array.isArray(routes) && routes.length === 0) ? (
            <div className="bg-theme-surface border border-theme-border/50 rounded-xl p-8 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-theme-surface-muted/50">
                <Bus className="h-6 w-6 text-theme-text-muted" />
              </div>
              <h3 className="mt-3 text-base font-medium text-theme-text">No routes found</h3>
              <p className="mt-1 text-sm text-theme-text-muted">
                We couldn't find any routes matching your search. Try adjusting your filters.
              </p>
              <div className="mt-6">
                <button
                  type="button"
                  onClick={resetFilters}
                  className="inline-flex items-center rounded-md bg-primary px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-dark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                >
                  <XCircle className="-ml-0.5 mr-1.5 h-4 w-4" />
                  Clear all filters
                </button>
              </div>
            </div>
          ) : (
            <React.Fragment>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {Array.isArray(routes) && routes.map((route) => (
                  <div 
                    key={route._id} 
                    className={`group relative overflow-hidden rounded-xl border ${
                      route.isActive 
                        ? 'border-theme-border/50 hover:border-primary/50' 
                        : 'border-theme-border/30 opacity-80 hover:opacity-100'
                    } bg-theme-surface shadow-sm transition-all duration-200 hover:shadow-md`}
                  >
                    {/* Status Badge */}
                    <div className="absolute right-3 top-3 z-10">
                      <span 
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          route.isActive 
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-200' 
                            : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
                        }`}
                      >
                        <span className={`mr-1.5 h-2 w-2 rounded-full ${
                          route.isActive ? 'bg-green-500' : 'bg-gray-400'
                        }`}></span>
                        {route.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    
                    {/* Route Content */}
                    <div className="p-5">
                      <div className="mb-4">
                        <h3 className="text-lg font-semibold text-theme-text group-hover:text-primary transition-colors line-clamp-2">
                          {route.routeName}
                        </h3>
                        <p className="mt-1 text-sm text-theme-text-muted">
                          {route.stops?.length ? `${route.stops.length} stops` : 'Direct route'}
                        </p>
                      </div>
                      
                      {/* Route Path */}
                      <div className="mb-4 space-y-3">
                        <div className="flex items-start">
                          <div className="flex-shrink-0 mt-1">
                            <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center">
                              <MapPin className="h-3 w-3 text-primary" />
                            </div>
                          </div>
                          <div className="ml-3">
                            <p className="text-sm font-medium text-theme-text">From</p>
                            <p className="text-sm text-theme-text-muted">{route.startLocation.name}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-start">
                          <div className="flex-shrink-0 ml-2">
                            <div className="h-6 w-0.5 bg-theme-border/50 mx-auto"></div>
                          </div>
                        </div>
                        
                        <div className="flex items-start">
                          <div className="flex-shrink-0 mt-1">
                            <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center">
                              <MapPin className="h-3 w-3 text-primary" />
                            </div>
                          </div>
                          <div className="ml-3">
                            <p className="text-sm font-medium text-theme-text">To</p>
                            <p className="text-sm text-theme-text-muted">{route.endLocation.name}</p>
                          </div>
                        </div>
                      </div>
                      
                      {/* Route Details */}
                      <div className="mt-4 grid grid-cols-3 gap-2 text-sm">
                        <div className="rounded-lg bg-theme-surface-muted/50 p-2 text-center">
                          <p className="text-xs text-theme-text-muted">Duration</p>
                          <p className="font-medium text-theme-text">
                            {Math.ceil(route.estimatedDuration / 60)} min
                          </p>
                        </div>
                        <div className="rounded-lg bg-theme-surface-muted/50 p-2 text-center">
                          <p className="text-xs text-theme-text-muted">Distance</p>
                          <p className="font-medium text-theme-text">
                            {(route.distance / 1000).toFixed(1)} km
                          </p>
                        </div>
                        <div className="rounded-lg bg-theme-surface-muted/50 p-2 text-center">
                          <p className="text-xs text-theme-text-muted">Fare</p>
                          <p className="font-medium text-theme-text">
                            KES {route.fare.toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Footer */}
                    <div className="border-t border-theme-border/50 bg-theme-surface-muted/30 px-5 py-3">
                      <div className="flex justify-between items-center">
                        <div className="text-sm text-theme-text-muted">
                          {route.schedule ? (
                            <span className="flex items-center">
                              <Clock className="h-3.5 w-3.5 mr-1.5" />
                              {route.schedule[0]?.departureTime} - {route.schedule[0]?.arrivalTime}
                            </span>
                          ) : (
                            <span>No schedule available</span>
                          )}
                        </div>
                        <Link
                          to={`/routes/${route._id}`}
                          className="inline-flex items-center text-sm font-medium text-primary hover:text-primary-dark transition-colors"
                        >
                          View details
                          <ArrowRight className="ml-1 h-4 w-4" />
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </React.Fragment>
          )}
        </div>
      </div>
    </div>
  );
};

export default Routes;
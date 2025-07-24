import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Calendar, Filter, Bus, Clock, MapPin } from 'lucide-react';
import axios from 'axios';
import { format } from 'date-fns';
import { useAuth } from '../contexts/AuthContext';

interface Schedule {
  _id: string;
  routeId: {
    _id: string;
    routeName: string;
    startLocation: { name: string };
    endLocation: { name: string };
  };
  driverId: {
    _id: string;
    name: string;
    phone: string;
    operatorName: string;
  };
  vehicleRegNumber: string;
  departureTime: string;
  estimatedArrivalTime: string;
  status: 'scheduled' | 'departed' | 'arrived' | 'cancelled';
  passengerCount: number;
  capacity: number;
  fare: number;
}

const Schedules: React.FC = () => {
  const { user } = useAuth();
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [statusFilter, setStatusFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchSchedules();
  }, [selectedDate, statusFilter, searchTerm]);

  const fetchSchedules = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (selectedDate) params.append('date', selectedDate);
      if (statusFilter) params.append('status', statusFilter);
      if (searchTerm) params.append('search', searchTerm);
      if (user && user.role === 'driver') params.append('driverId', user._id);

      const response = await axios.get(`/api/schedules?${params.toString()}`);
      setSchedules(response.data.data.schedules);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch schedules');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'bg-blue-100 text-blue-800';
      case 'departed':
        return 'bg-yellow-100 text-yellow-800';
      case 'arrived':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 py-8 text-gray-800 dark:text-gray-100">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-black dark:text-white mb-4">
            Matatu Schedules
          </h1>
          <p className="text-lg text-gray-700 dark:text-gray-300">
            Real-time matatu departure and arrival schedules
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8 text-gray-900 dark:text-gray-100 sticky top-0 z-30">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="date" className="block text-sm font-medium text-gray-300 mb-1">
                <span className="text-gray-900 dark:text-gray-300">Date</span>
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500" />
                <input
                  type="date"
                  id="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
                />
              </div>
            </div>

            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-300 mb-1">
                <span className="text-gray-900 dark:text-gray-300">Status</span>
              </label>
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500" />
                <select
                  id="status"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
                >
                  <option value="">All Status</option>
                  <option value="scheduled">Scheduled</option>
                  <option value="departed">Departed</option>
                  <option value="arrived">Arrived</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="search" className="block text-sm font-medium text-gray-300 mb-1">
                <span className="text-gray-900 dark:text-gray-300">Search</span>
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500" />
                <input
                  type="text"
                  id="search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
                  placeholder="Search routes, operators..."
                />
              </div>
            </div>
          </div>
        </div>

        {/* Floating Action Button for Drivers */}
        {user?.role === 'driver' && (
          <Link
            to="/schedules/create"
            className="fixed bottom-8 right-8 z-40 bg-gradient-to-r from-blue-600 to-green-500 hover:from-blue-700 hover:to-green-600 text-white rounded-full shadow-lg p-4 flex items-center gap-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-500"
            aria-label="Create new schedule"
          >
            <Bus className="h-6 w-6" />
            <span className="hidden sm:inline font-semibold">New Schedule</span>
          </Link>
        )}

        {/* Results */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mb-4"></div>
            <p className="text-gray-500 dark:text-gray-400 text-lg">Loading schedules...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
            <p className="text-red-800">{error}</p>
          </div>
        ) : (
          <div className="space-y-4">
            {schedules.length === 0 ? (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 text-center flex flex-col items-center">
                <Bus className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                  No schedules found
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Try adjusting your search criteria or check back later
                </p>
                {user?.role === 'driver' && (
                  <Link to="/schedules/create" className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-green-500 hover:from-blue-700 hover:to-green-600 text-white font-semibold px-5 py-2 rounded-lg shadow transition-all duration-200">
                    <Bus className="h-5 w-5" /> Create New Schedule
                  </Link>
                )}
              </div>
            ) : (
              schedules.map((schedule) => (
                <Link
                  key={schedule._id}
                  to={`/schedules/${schedule._id}`}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-xl hover:scale-[1.01] transition-all p-6 block focus:outline-none focus:ring-2 focus:ring-green-500"
                  aria-label={`View details for schedule on route ${schedule.routeId.routeName}`}
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-2">
                    <div className="flex items-center">
                      <Bus className="h-6 w-6 text-green-600 mr-3" />
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                          {schedule.routeId.routeName}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {schedule.routeId.startLocation.name} → {schedule.routeId.endLocation.name}
                        </p>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(schedule.status)}`}> 
                      {schedule.status.charAt(0).toUpperCase() + schedule.status.slice(1)}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-5 gap-2 md:gap-4 text-sm">
                    <div>
                      <p className="text-gray-600 dark:text-gray-400">Vehicle</p>
                      <p className="font-medium text-gray-900 dark:text-gray-100">{schedule.vehicleRegNumber}</p>
                    </div>
                    <div>
                      <p className="text-gray-600 dark:text-gray-400">Operator</p>
                      <p className="font-medium text-gray-900 dark:text-gray-100">{schedule.driverId.operatorName}</p>
                    </div>
                    <div>
                      <p className="text-gray-600 dark:text-gray-400">Departure</p>
                      <p className="font-medium text-gray-900 dark:text-gray-100">
                        {format(new Date(schedule.departureTime), 'h:mm a')}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600 dark:text-gray-400">Passengers</p>
                      <p className="font-medium text-gray-900 dark:text-gray-100">
                        {schedule.passengerCount}/{schedule.capacity}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600 dark:text-gray-400">Fare</p>
                      <p className="font-medium text-green-600 dark:text-green-400">
                        KES {schedule.fare}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span>View details and updates</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                      <Clock className="h-4 w-4 mr-1" />
                      <span>ETA: {format(new Date(schedule.estimatedArrivalTime), 'h:mm a')}</span>
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Schedules;
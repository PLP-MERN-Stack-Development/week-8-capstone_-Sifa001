import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, Clock, DollarSign, Bus, ArrowLeft, Calendar } from 'lucide-react';
import axios from 'axios';
import { format } from 'date-fns';

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
}

interface Schedule {
  _id: string;
  routeId: Route;
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

const RouteDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [route, setRoute] = useState<Route | null>(null);
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    if (id) {
      fetchRouteDetails();
      fetchSchedules();
    }
  }, [id, selectedDate]);

  const fetchRouteDetails = async () => {
    try {
      const response = await axios.get(`/api/routes/${id}`);
      setRoute(response.data.data.route);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch route details');
    }
  };

  const fetchSchedules = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/schedules?routeId=${id}&date=${selectedDate}`);
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

  if (!route && !loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Route not found</h2>
          <Link to="/routes" className="text-green-600 hover:text-green-700">
            ← Back to routes
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 py-8 text-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Link
          to="/routes"
          className="inline-flex items-center text-green-400 hover:text-green-500 mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to routes
        </Link>

        {route && (
          <>
            {/* Route Header */}
            <div className="bg-gray-800 rounded-lg shadow-md p-6 mb-8">
              <div className="flex items-center justify-between mb-4">
                <h1 className="text-3xl font-bold text-white">{route.routeName}</h1>
                <div className="text-2xl font-bold text-green-400">
                  KES {route.fare}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex items-center">
                  <MapPin className="h-5 w-5 text-gray-500 mr-3" />
                  <div>
                    <p className="text-sm text-gray-300">Route</p>
                    <p className="font-medium text-white">{route.startLocation.name} → {route.endLocation.name}</p>
                  </div>
                </div>

                <div className="flex items-center">
                  <Clock className="h-5 w-5 text-gray-500 mr-3" />
                  <div>
                    <p className="text-sm text-gray-300">Duration</p>
                    <p className="font-medium text-white">{route.estimatedDuration} minutes</p>
                  </div>
                </div>

                <div className="flex items-center">
                  <DollarSign className="h-5 w-5 text-gray-500 mr-3" />
                  <div>
                    <p className="text-sm text-gray-300">Distance</p>
                    <p className="font-medium text-white">{route.distance} km</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Date Selector */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">Schedules</h2>
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 text-gray-400 mr-2" />
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                </div>
              </div>
            </div>

            {/* Schedules List */}
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
              </div>
            ) : error ? (
              <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
                <p className="text-red-800">{error}</p>
              </div>
            ) : (
              <div className="space-y-4">
                {schedules.length === 0 ? (
                  <div className="bg-white rounded-lg shadow-md p-8 text-center">
                    <Bus className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      No schedules found
                    </h3>
                    <p className="text-gray-600">
                      No matatu schedules available for {format(new Date(selectedDate), 'MMMM d, yyyy')}
                    </p>
                  </div>
                ) : (
                  schedules.map((schedule) => (
                    <Link
                      key={schedule._id}
                      to={`/schedules/${schedule._id}`}
                      className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 block"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center">
                          <Bus className="h-6 w-6 text-green-600 mr-3" />
                          <div>
                            <h3 className="font-semibold text-gray-900">
                              {schedule.vehicleRegNumber}
                            </h3>
                            <p className="text-sm text-gray-600">
                              {schedule.driverId.operatorName}
                            </p>
                          </div>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(schedule.status)}`}>
                          {schedule.status.charAt(0).toUpperCase() + schedule.status.slice(1)}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="text-gray-600">Departure</p>
                          <p className="font-medium">
                            {format(new Date(schedule.departureTime), 'h:mm a')}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-600">Arrival</p>
                          <p className="font-medium">
                            {format(new Date(schedule.estimatedArrivalTime), 'h:mm a')}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-600">Passengers</p>
                          <p className="font-medium">
                            {schedule.passengerCount}/{schedule.capacity}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-600">Fare</p>
                          <p className="font-medium text-green-600">
                            KES {schedule.fare}
                          </p>
                        </div>
                      </div>
                    </Link>
                  ))
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default RouteDetail;
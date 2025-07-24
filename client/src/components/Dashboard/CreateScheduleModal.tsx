import React, { useState, useEffect } from 'react';
import { X, MapPin, Clock, Users, DollarSign } from 'lucide-react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';

interface Route {
  _id: string;
  routeName: string;
  startLocation: { name: string };
  endLocation: { name: string };
  fare: number;
  estimatedDuration: number;
}

interface CreateScheduleForm {
  routeId: string;
  departureTime: string;
  capacity: number;
  fare: number;
}

interface CreateScheduleModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

const CreateScheduleModal = ({ onClose, onSuccess }: CreateScheduleModalProps) => {
  const { user } = useAuth();
  const [routes, setRoutes] = useState<Route[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors }
  } = useForm<CreateScheduleForm>();

  const selectedRouteId = watch('routeId');
  const selectedRoute = Array.isArray(routes) ? routes.find(r => r._id === selectedRouteId) : undefined;

  useEffect(() => {
    fetchRoutes();
  }, []);

  useEffect(() => {
    if (selectedRoute) {
      setValue('fare', selectedRoute.fare);
    }
  }, [selectedRoute, setValue]);

  const fetchRoutes = async () => {
    try {
      const response = await axios.get('/api/routes');
      // Support both { data: { routes: [...] } } and { data: [...] }
      const data = response.data.data;
      setRoutes(Array.isArray(data) ? data : data?.routes || []);
    } catch (err: any) {
      setError('Failed to fetch routes');
    }
  };

  const onSubmit = async (data: CreateScheduleForm) => {
    try {
      setLoading(true);
      setError('');
      
      await axios.post('/api/schedules', {
        routeId: data.routeId,
        departureTime: data.departureTime,
        capacity: Number(data.capacity),
        fare: Number(data.fare)
      });
      
      onSuccess();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create schedule');
    } finally {
      setLoading(false);
    }
  };

  // Get minimum datetime (current time + 30 minutes)
  const getMinDateTime = () => {
    const now = new Date();
    now.setMinutes(now.getMinutes() + 30);
    return now.toISOString().slice(0, 16);
  };

  return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-purple-500">
          <h2 className="text-xl font-semibold text-white">Create New Schedule</h2>
          <button
            onClick={onClose}
            className="text-gray-200 hover:text-white transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4 w-full">
          {error && (
            <div className="bg-red-900 border border-red-700 rounded-md p-3">
              <p className="text-sm text-red-200">{error}</p>
            </div>
          )}

          {/* Route Selection */}
          <div>
            <label htmlFor="routeId" className="block text-sm font-medium text-white mb-1">
              Route
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <select
                id="routeId"
                {...register('routeId', { required: 'Please select a route' })}
                className="block w-full pl-10 pr-3 py-2 border border-purple-500 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-gray-900 text-white"
              >
                <option value="">Select a route</option>
                {routes.map((route) => (
                  <option key={route._id} value={route._id}>
                    {route.routeName} - {route.startLocation.name} → {route.endLocation.name}
                  </option>
                ))}
              </select>
            </div>
            {errors.routeId && (
              <p className="mt-1 text-sm text-red-300">{errors.routeId.message}</p>
            )}
          </div>

          {/* Departure Time */}
          <div>
            <label htmlFor="departureTime" className="block text-sm font-medium text-white mb-1">
              Departure Time
            </label>
            <div className="relative">
              <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                id="departureTime"
                {...register('departureTime', { 
                  required: 'Departure time is required',
                  validate: (value) => {
                    const selectedTime = new Date(value);
                    const minTime = new Date();
                    minTime.setMinutes(minTime.getMinutes() + 30);
                    return selectedTime >= minTime || 'Departure time must be at least 30 minutes from now';
                  }
                })}
                type="datetime-local"
                min={getMinDateTime()}
                className="block w-full pl-10 pr-3 py-2 border border-purple-500 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-gray-900 text-white"
              />
            </div>
            {errors.departureTime && (
              <p className="mt-1 text-sm text-red-300">{errors.departureTime.message}</p>
            )}
          </div>

          {/* Capacity */}
          <div>
            <label htmlFor="capacity" className="block text-sm font-medium text-white mb-1">
              Vehicle Capacity
            </label>
            <div className="relative">
              <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                id="capacity"
                {...register('capacity', { 
                  required: 'Capacity is required',
                  min: { value: 1, message: 'Capacity must be at least 1' },
                  max: { value: 25, message: 'Capacity cannot exceed 25' }
                })}
                type="number"
                min="1"
                max="25"
                className="block w-full pl-10 pr-3 py-2 border border-purple-500 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-gray-900 text-white"
                placeholder="e.g., 14"
              />
            </div>
            {errors.capacity && (
              <p className="mt-1 text-sm text-red-300">{errors.capacity.message}</p>
            )}
          </div>

          {/* Fare */}
          <div>
            <label htmlFor="fare" className="block text-sm font-medium text-white mb-1">
              Fare (KES)
            </label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                id="fare"
                {...register('fare', { 
                  required: 'Fare is required',
                  min: { value: 10, message: 'Fare must be at least 10 KES' }
                })}
                type="number"
                min="10"
                className="block w-full pl-10 pr-3 py-2 border border-purple-500 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-gray-900 text-white"
                placeholder="e.g., 50"
              />
            </div>
            {errors.fare && (
              <p className="mt-1 text-sm text-red-300">{errors.fare.message}</p>
            )}
            {selectedRoute && (
              <p className="mt-1 text-sm text-gray-200">
                Suggested fare: KES {selectedRoute.fare}
              </p>
            )}
          </div>

          {/* Vehicle Info Display */}
          {user && (
            <div className="bg-gray-900 rounded-md p-3">
              <h4 className="text-sm font-medium text-white mb-2">Vehicle Information</h4>
              <div className="text-sm text-gray-200 space-y-1">
                <p><span className="font-medium">Registration:</span> {user.vehicleRegNumber}</p>
                <p><span className="font-medium">Operator:</span> {user.operatorName}</p>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-purple-500 rounded-md text-sm font-medium text-white hover:bg-purple-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-700 to-purple-700 hover:from-blue-800 hover:to-purple-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating...' : 'Create Schedule'}
            </button>
          </div>
        </form>
      </div>
    </div>  
  );
};

export default CreateScheduleModal;
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Bus, Clock, MapPin, User, Phone, MessageSquare, AlertCircle } from 'lucide-react';
import axios from 'axios';
import { format } from 'date-fns';
import { useAuth } from '../contexts/AuthContext';
import { useSocket } from '../contexts/SocketContext';

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
  actualDepartureTime?: string;
  estimatedArrivalTime: string;
  actualArrivalTime?: string;
  status: 'scheduled' | 'departed' | 'arrived' | 'cancelled';
  passengerCount: number;
  capacity: number;
  fare: number;
}

interface ScheduleUpdate {
  _id: string;
  userId: {
    _id: string;
    name: string;
    role: 'driver' | 'passenger';
  };
  updateType: string;
  message: string;
  timestamp: string;
  isVerified: boolean;
}

const ScheduleDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { socket, joinRoute, leaveRoute } = useSocket();
  const [schedule, setSchedule] = useState<Schedule | null>(null);
  const [updates, setUpdates] = useState<ScheduleUpdate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newUpdate, setNewUpdate] = useState({ type: 'delay', message: '' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (id) {
      fetchScheduleDetails();
      fetchUpdates();
    }
  }, [id]);

  useEffect(() => {
    if (schedule && socket) {
      joinRoute(schedule.routeId._id);

      // Listen for real-time updates
      socket.on('schedule-updated', handleScheduleUpdate);
      socket.on('schedule-update-added', handleNewUpdate);

      return () => {
        leaveRoute(schedule.routeId._id);
        socket.off('schedule-updated');
        socket.off('schedule-update-added');
      };
    }
  }, [schedule, socket]);

  const fetchScheduleDetails = async () => {
    try {
      const response = await axios.get(`/api/schedules/${id}`);
      setSchedule(response.data.data.schedule);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch schedule details');
    } finally {
      setLoading(false);
    }
  };

  const fetchUpdates = async () => {
    try {
      const response = await axios.get(`/api/schedules/${id}/updates`);
      setUpdates(response.data.data.updates);
    } catch (err: any) {
      console.error('Failed to fetch updates:', err);
    }
  };

  const handleScheduleUpdate = (data: any) => {
    if (data.schedule._id === id) {
      setSchedule(data.schedule);
    }
  };

  const handleNewUpdate = (data: any) => {
    if (data.scheduleId === id) {
      setUpdates(prev => [data.update, ...prev]);
    }
  };

  const submitUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newUpdate.message.trim()) return;

    try {
      setSubmitting(true);
      await axios.post(`/api/schedules/${id}/updates`, {
        updateType: newUpdate.type,
        message: newUpdate.message.trim()
      });
      setNewUpdate({ type: 'delay', message: '' });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to submit update');
    } finally {
      setSubmitting(false);
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (!schedule) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Schedule not found</h2>
          <Link to="/schedules" className="text-green-600 hover:text-green-700">
            ← Back to schedules
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 py-8 text-gray-800 dark:text-gray-100">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        {/* Back Button */}
        <Link
          to="/schedules"
          className="inline-flex items-center text-green-400 hover:text-green-500 mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to schedules
        </Link>

        {error && (
          <div className="bg-red-900 border border-red-700 rounded-md p-4 mb-6">
            <div className="flex">
              <AlertCircle className="h-5 w-5 text-red-300" />
              <div className="ml-3">
                <p className="text-sm text-red-200">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Schedule Details */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <Bus className="h-8 w-8 text-green-400 mr-3" />
              <div>
                <h1 className="text-2xl font-bold text-black dark:text-white">
                  {schedule.routeId.routeName}
                </h1>
                <p className="text-gray-700 dark:text-gray-300">
                  {schedule.routeId.startLocation.name} → {schedule.routeId.endLocation.name}
                </p>
              </div>
            </div>
            <span className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(schedule.status)}`}>
              {schedule.status.charAt(0).toUpperCase() + schedule.status.slice(1)}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="flex items-center">
              <Clock className="h-5 w-5 text-gray-400 mr-3" />
              <div>
                <p className="text-sm text-gray-700 dark:text-gray-300">Scheduled Departure</p>
                <p className="font-medium">
                  {format(new Date(schedule.departureTime), 'h:mm a')}
                </p>
                {schedule.actualDepartureTime && (
                  <p className="text-sm text-green-600 dark:text-green-400">
                    Actual: {format(new Date(schedule.actualDepartureTime), 'h:mm a')}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center">
              <Clock className="h-5 w-5 text-gray-400 mr-3" />
              <div>
                <p className="text-sm text-gray-700 dark:text-gray-300">Estimated Arrival</p>
                <p className="font-medium">
                  {format(new Date(schedule.estimatedArrivalTime), 'h:mm a')}
                </p>
                {schedule.actualArrivalTime && (
                  <p className="text-sm text-green-600 dark:text-green-400">
                    Actual: {format(new Date(schedule.actualArrivalTime), 'h:mm a')}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center">
              <User className="h-5 w-5 text-gray-400 mr-3" />
              <div>
                <p className="text-sm text-gray-700 dark:text-gray-300">Passengers</p>
                <p className="font-medium">
                  {schedule.passengerCount}/{schedule.capacity}
                </p>
              </div>
            </div>

            <div className="flex items-center">
              <MapPin className="h-5 w-5 text-gray-400 mr-3" />
              <div>
                <p className="text-sm text-gray-700 dark:text-gray-300">Fare</p>
                <p className="font-medium text-green-600 dark:text-green-400">
                  KES {schedule.fare}
                </p>
              </div>
            </div>
          </div>

          {/* Driver Info */}
          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-black dark:text-white mb-3">Driver Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-700 dark:text-gray-300">Driver</p>
                <p className="font-medium">{schedule.driverId.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-700 dark:text-gray-300">Vehicle</p>
                <p className="font-medium">{schedule.vehicleRegNumber}</p>
              </div>
              <div>
                <p className="text-sm text-gray-700 dark:text-gray-300">Operator</p>
                <p className="font-medium">{schedule.driverId.operatorName}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Add Update Form */}
        {user && (
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md p-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Report Update
            </h3>
            <form onSubmit={submitUpdate} className="space-y-4">
              <div>
                <label htmlFor="updateType" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Update Type
                </label>
                <select
                  id="updateType"
                  value={newUpdate.type}
                  onChange={(e) => setNewUpdate({ ...newUpdate, type: e.target.value })}
                  className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                >
                  <option value="delay">Delay</option>
                  <option value="departure">Departure</option>
                  <option value="arrival">Arrival</option>
                  <option value="cancellation">Cancellation</option>
                  <option value="passenger_count">Passenger Count</option>
                </select>
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Message
                </label>
                <textarea
                  id="message"
                  value={newUpdate.message}
                  onChange={(e) => setNewUpdate({ ...newUpdate, message: e.target.value })}
                  rows={3}
                  className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                  placeholder="Describe the update..."
                  required
                />
              </div>
              <button
                type="submit"
                disabled={submitting || !newUpdate.message.trim()}
                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? 'Submitting...' : 'Submit Update'}
              </button>
            </form>
          </div>
        )}

        {/* Updates Timeline */}
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Recent Updates
          </h3>
          {updates.length === 0 ? (
            <div className="text-center py-8">
              <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400">No updates yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {updates.map((update) => (
                <div key={update._id} className="border-l-4 border-green-200 dark:border-green-700 pl-4 py-2">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <span className="font-medium text-gray-900 dark:text-gray-100">
                        {update.userId.name}
                      </span>
                      <span className={`ml-2 px-2 py-1 rounded-full text-xs ${
                        update.userId.role === 'driver' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
                      }`}>
                        {update.userId.role}
                      </span>
                      {update.isVerified && (
                        <span className="ml-2 px-2 py-1 rounded-full text-xs bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                          Verified
                        </span>
                      )}
                    </div>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {format(new Date(update.timestamp), 'h:mm a')}
                    </span>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300">{update.message}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Update type: {update.updateType.replace('_', ' ')}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ScheduleDetail;
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import RouteStatus from '../components/Dashboard/RouteStatus';
import CreateScheduleModal from '../components/Dashboard/CreateScheduleModal';
import EarningsTracker from '../components/Dashboard/EarningsTracker';
import FeedbackList from '../components/Dashboard/FeedbackList';

const DriverDashboard: React.FC = () => {
  const { user } = useAuth();
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  if (!user) return null; // or a loading spinner

  const handleScheduleSuccess = () => {
    setShowScheduleModal(false);
    setRefreshKey(k => k + 1); // trigger refresh if needed
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col">
      <header className="flex flex-col md:flex-row items-start md:items-center justify-between px-4 sm:px-6 lg:px-8 py-4 bg-gray-800 shadow-md gap-4 w-full">
        <h1 className="text-2xl font-bold text-white">SafariTrack (Driver)</h1>
        <div className="flex items-center gap-4">
          <span className="bg-green-700 text-white px-3 py-1 rounded-full text-sm font-medium">Driver</span>
        </div>
      </header>
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        <section className="w-full">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-2 gap-2 w-full">
            <h2 className="text-xl font-semibold">Assigned Routes</h2>
            <button
              onClick={() => setShowScheduleModal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium shadow w-full sm:w-auto"
            >
              + Create Schedule
            </button>
          </div>
          <RouteStatus driver={user} key={refreshKey} />
        </section>
        <section className="w-full">
          <EarningsTracker driver={user} />
        </section>
        <section className="w-full">
          <FeedbackList driverId={user._id} />
        </section>
        {showScheduleModal && (
          <CreateScheduleModal
            onClose={() => setShowScheduleModal(false)}
            onSuccess={handleScheduleSuccess}
          />
        )}
      </main>
    </div>
  );
};

export default DriverDashboard; 
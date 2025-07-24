import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import PassengerDashboard from './PassengerDashboard';
import DriverDashboard from './DriverDashboard';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  if (!user) return null; // or a loading spinner
  return (
    <div className="min-h-screen w-full bg-theme-bg text-theme-text transition-colors duration-200">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 w-full">
        {user.role === 'driver' ? <DriverDashboard /> : <PassengerDashboard />}
        </div>
    </div>
  );
};

export default Dashboard;
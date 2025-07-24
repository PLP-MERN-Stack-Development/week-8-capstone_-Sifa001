import React from 'react';

const Dashboard: React.FC = () => {
  // Mock metrics
  const metrics = [
    { label: 'Active Drivers', value: 120 },
    { label: 'Active Passengers', value: 2300 },
    { label: 'Total Routes', value: 58 },
    { label: 'Revenue (KES)', value: '1,200,000' },
    { label: 'Trips Today', value: 340 },
    { label: 'System Health', value: 'All Systems Operational' },
  ];

  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <h2 className="text-lg font-semibold mb-4">System Overview</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {metrics.map((m, i) => (
          <div key={i} className="bg-gray-900 rounded p-4 flex flex-col items-center">
            <span className="text-2xl font-bold text-green-400 mb-1">{m.value}</span>
            <span className="text-gray-300 text-sm">{m.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard; 
import React from 'react';

const Analytics: React.FC = () => {
  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <h2 className="text-lg font-semibold mb-4">Analytics & Insights</h2>
      <div className="h-40 bg-gray-900 rounded flex items-center justify-center text-gray-400 mb-4">Chart: Trips per Day</div>
      <div className="h-40 bg-gray-900 rounded flex items-center justify-center text-gray-400 mb-4">Chart: Revenue by Route</div>
      <div className="h-40 bg-gray-900 rounded flex items-center justify-center text-gray-400">Chart: User Growth</div>
    </div>
  );
};

export default Analytics; 
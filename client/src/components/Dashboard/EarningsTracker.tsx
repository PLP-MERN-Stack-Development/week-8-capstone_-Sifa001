import React, { useState } from 'react';

interface Props {
  driver: any;
}

const EarningsTracker: React.FC<Props> = ({ driver }) => {
  const [period, setPeriod] = useState<'daily' | 'weekly'>('daily');
  const earnings = period === 'daily' ? 3500 : 21000; // Mock data

  return (
    <div className="bg-gray-800 rounded-lg p-4 w-full">
      <h2 className="text-lg font-semibold mb-2">Earnings Tracker</h2>
      <div className="flex flex-col sm:flex-row items-center gap-4 mb-2 w-full">
        <button
          className={`px-3 py-1 rounded ${period === 'daily' ? 'bg-green-600 text-white' : 'bg-gray-700 text-gray-300'} w-full sm:w-auto`}
          onClick={() => setPeriod('daily')}
        >
          Daily
        </button>
        <button
          className={`px-3 py-1 rounded ${period === 'weekly' ? 'bg-green-600 text-white' : 'bg-gray-700 text-gray-300'} w-full sm:w-auto`}
          onClick={() => setPeriod('weekly')}
        >
          Weekly
        </button>
      </div>
      <div className="text-3xl font-bold text-green-400 mb-2">KES {earnings.toLocaleString()}</div>
      {/* Placeholder for chart */}
      <div className="h-16 bg-gray-700 rounded mt-2 flex items-center justify-center text-gray-400">Chart: Coming soon</div>
    </div>
  );
};

export default EarningsTracker; 
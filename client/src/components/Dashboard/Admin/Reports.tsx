import React from 'react';

const Reports: React.FC = () => {
  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <h2 className="text-lg font-semibold mb-4">Reports & Moderation</h2>
      <div className="mb-4">
        <h3 className="font-semibold mb-2">Financial Report</h3>
        <div className="bg-gray-900 rounded p-4 mb-2">Total Revenue: <span className="text-green-400">KES 1,200,000</span></div>
        <div className="bg-gray-900 rounded p-4">Pending Payouts: <span className="text-yellow-400">KES 80,000</span></div>
      </div>
      <div>
        <h3 className="font-semibold mb-2">Content Moderation</h3>
        <div className="bg-gray-900 rounded p-4 mb-2">Feedback: "Driver was late" <button className="ml-2 bg-yellow-600 text-white px-2 py-1 rounded">Review</button></div>
        <div className="bg-gray-900 rounded p-4">Report: "Inaccurate fare" <button className="ml-2 bg-yellow-600 text-white px-2 py-1 rounded">Review</button></div>
      </div>
    </div>
  );
};

export default Reports; 
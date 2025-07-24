import React from 'react';

const Settings: React.FC = () => {
  return (
    <div className="bg-gray-800 rounded-lg p-6 mt-8">
      <h2 className="text-lg font-semibold mb-4">Settings & Tools</h2>
      <div className="mb-4">
        <h3 className="font-semibold mb-2">System Notifications & Announcements</h3>
        <textarea className="w-full rounded bg-gray-900 text-gray-100 p-2 mb-2" rows={2} placeholder="Write announcement..." />
        <button className="bg-blue-600 text-white px-4 py-2 rounded">Send</button>
      </div>
      <div className="mb-4">
        <h3 className="font-semibold mb-2">Bulk Data Import/Export</h3>
        <button className="bg-green-600 text-white px-4 py-2 rounded mr-2">Import</button>
        <button className="bg-yellow-600 text-white px-4 py-2 rounded">Export</button>
      </div>
      <div>
        <h3 className="font-semibold mb-2">Advanced Filtering & Search</h3>
        <input className="w-full rounded bg-gray-900 text-gray-100 p-2" placeholder="Search system data..." />
      </div>
    </div>
  );
};

export default Settings; 
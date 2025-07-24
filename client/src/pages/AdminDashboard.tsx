import React from 'react';

const AdminDashboard: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col">
      <header className="px-4 sm:px-6 lg:px-8 py-4 bg-gray-800 shadow-md">
        <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
      </header>
      <main className="flex-1 w-full max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        <section className="bg-gray-800 rounded-lg p-4 w-full">
          <h2 className="text-lg font-semibold mb-2">System Overview</h2>
          <div className="text-gray-400">Metrics and system health go here.</div>
        </section>
        <section className="bg-gray-800 rounded-lg p-4 w-full">
          <h2 className="text-lg font-semibold mb-2">User Management</h2>
          <div className="text-gray-400">Add, edit, or remove users here.</div>
        </section>
        <section className="bg-gray-800 rounded-lg p-4 w-full">
          <h2 className="text-lg font-semibold mb-2">Reports</h2>
          <div className="text-gray-400">View and download system reports here.</div>
        </section>
      </main>
    </div>
  );
};

export default AdminDashboard;
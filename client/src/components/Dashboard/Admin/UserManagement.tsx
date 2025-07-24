import React, { useState } from 'react';

const mockUsers = [
  { id: 1, name: 'Jane Doe', role: 'passenger', status: 'active' },
  { id: 2, name: 'John Driver', role: 'driver', status: 'pending' },
  { id: 3, name: 'Operator X', role: 'operator', status: 'active' },
];

const UserManagement: React.FC = () => {
  const [search, setSearch] = useState('');
  const [role, setRole] = useState('all');

  const filtered = mockUsers.filter(u =>
    (role === 'all' || u.role === role) &&
    (u.name.toLowerCase().includes(search.toLowerCase()) || u.role.includes(search.toLowerCase()))
  );

  return (
    <div className="bg-gray-800 rounded-lg p-6 w-full overflow-x-auto">
      <h2 className="text-lg font-semibold mb-4">User Management</h2>
      <div className="flex gap-2 mb-4 flex-col sm:flex-row w-full">
        <input
          type="text"
          placeholder="Search users..."
          className="px-3 py-2 rounded bg-gray-900 text-gray-100 border border-gray-700 w-full sm:w-auto"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <select
          className="px-3 py-2 rounded bg-gray-900 text-gray-100 border border-gray-700 w-full sm:w-auto"
          value={role}
          onChange={e => setRole(e.target.value)}
        >
          <option value="all">All</option>
          <option value="passenger">Passenger</option>
          <option value="driver">Driver</option>
          <option value="operator">Operator</option>
        </select>
      </div>
      <table className="w-full text-sm min-w-[600px]">
        <thead>
          <tr className="text-gray-400">
            <th className="text-left py-2">Name</th>
            <th className="text-left py-2">Role</th>
            <th className="text-left py-2">Status</th>
            <th className="text-left py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map(user => (
            <tr key={user.id} className="border-b border-gray-700">
              <td className="py-2">{user.name}</td>
              <td className="py-2 capitalize">{user.role}</td>
              <td className="py-2">{user.status}</td>
              <td className="py-2">
                {user.role === 'driver' && user.status === 'pending' && (
                  <button className="bg-green-600 text-white px-2 py-1 rounded mr-2">Verify</button>
                )}
                <button className="bg-yellow-600 text-white px-2 py-1 rounded mr-2">Suspend</button>
                <button className="bg-red-600 text-white px-2 py-1 rounded">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserManagement; 
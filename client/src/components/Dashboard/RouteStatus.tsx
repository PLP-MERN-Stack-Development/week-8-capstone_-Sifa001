import React, { useState } from 'react';

interface Props {
  driver: any;
}

const mockRoutes = [
  { id: '1', name: 'CBD - Rongai', status: 'Ready' },
  { id: '2', name: 'CBD - Gikambura', status: 'En Route' },
];

const RouteStatus: React.FC<Props> = ({ driver }) => {
  const [routes, setRoutes] = useState(mockRoutes);

  const updateStatus = (id: string, status: string) => {
    setRoutes(routes => routes.map(r => r.id === id ? { ...r, status } : r));
  };

  return (
    <div className="bg-gray-800 rounded-lg p-4 w-full">
      <h2 className="text-lg font-semibold mb-2">Assigned Routes</h2>
      <ul className="space-y-2 w-full">
        {routes.map(route => (
          <li key={route.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between w-full gap-2">
            <span className="text-base">{route.name}</span>
            <select
              value={route.status}
              onChange={e => updateStatus(route.id, e.target.value)}
              className="bg-gray-700 text-white rounded px-2 py-1 w-full sm:w-auto"
            >
              <option>Ready</option>
              <option>En Route</option>
              <option>Completed</option>
            </select>
          </li>
        ))}
      </ul>
      {/* Placeholder for analytics */}
      <div className="mt-4 text-sm text-gray-400">Analytics: Coming soon</div>
    </div>
  );
};

export default RouteStatus; 
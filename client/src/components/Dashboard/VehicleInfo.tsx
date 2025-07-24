import React from 'react';

interface Props {
  driver: any;
}

const VehicleInfo: React.FC<Props> = ({ driver }) => {
  return (
    <div className="bg-gray-800 rounded-lg p-4 w-full">
      <h2 className="text-lg font-semibold mb-2">Vehicle Info & Maintenance</h2>
      <div className="mb-2 text-base">Vehicle: KDA 123A</div>
      <div className="mb-2 text-base">Next Maintenance: <span className="text-yellow-400">2024-07-15</span></div>
      <div className="mb-2 text-base">Emergency Contact: <span className="text-blue-400">0712 345678</span></div>
      <div className="mb-2 text-base">Fuel Cost (Today): <span className="text-green-400">KES 2,000</span></div>
      <div className="mb-2 text-base">Other Expenses: <span className="text-red-400">KES 500</span></div>
      <div className="mb-2 text-base">Driver Rating: <span className="text-yellow-400">4.7 / 5</span></div>
      <div className="mb-2 text-base">Feedback: <span className="text-gray-300">"Very punctual and polite."</span></div>
      {/* Placeholders for digital logbook, expense tracking, etc. */}
      <div className="mt-4 text-sm text-gray-400">Digital Logbook, Expense Tracking, and more coming soon.</div>
    </div>
  );
};

export default VehicleInfo; 
import React, { useState } from 'react';

interface Props {
  driver: any;
}

const DepartureLogger: React.FC<Props> = ({ driver }) => {
  const [checkedIn, setCheckedIn] = useState(false);
  const [passengerCount, setPassengerCount] = useState(0);
  const [capacity, setCapacity] = useState(14);
  const [time, setTime] = useState(new Date());

  React.useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const handleCheckIn = () => {
    setCheckedIn(true);
    // TODO: Log check-in to backend
  };

  return (
    <div className="bg-gray-800 rounded-lg p-4 w-full">
      <h2 className="text-lg font-semibold mb-2">Departure Logger</h2>
      <div className="mb-2">Current Time: <span className="font-mono">{time.toLocaleTimeString()}</span></div>
      <button
        className={`px-4 py-2 rounded font-bold text-white ${checkedIn ? 'bg-green-600' : 'bg-blue-600'} mb-2 w-full sm:w-auto`}
        onClick={handleCheckIn}
        disabled={checkedIn}
      >
        {checkedIn ? 'Checked In' : 'One-Tap Check-In'}
      </button>
      <div className="flex flex-col sm:flex-row items-center gap-2 mt-2 w-full">
        <span>Passengers:</span>
        <input
          type="number"
          min={0}
          max={capacity}
          value={passengerCount}
          onChange={e => setPassengerCount(Number(e.target.value))}
          className="w-16 px-2 py-1 rounded bg-gray-900 text-gray-100 border border-gray-700"
        />
        <span>/ {capacity}</span>
      </div>
    </div>
  );
};

export default DepartureLogger; 
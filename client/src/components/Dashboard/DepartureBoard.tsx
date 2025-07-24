import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';

interface Props {
  selectedRoute: any;
  onError: (msg: string) => void;
  language: 'en' | 'sw';
}

const labels = {
  en: {
    departures: 'Departures',
    fare: 'Fare',
    seats: 'Seats',
    time: 'Time',
    countdown: 'Countdown',
    noDepartures: 'No departures found.',
    travelTime: 'Est. Travel Time',
  },
  sw: {
    departures: 'Kuondoka',
    fare: 'Nauli',
    seats: 'Viti',
    time: 'Muda',
    countdown: 'Muda uliosalia',
    noDepartures: 'Hakuna kuondoka.',
    travelTime: 'Muda wa Safari',
  },
};

function formatKES(amount: number) {
  return amount.toLocaleString('en-KE', { style: 'currency', currency: 'KES', minimumFractionDigits: 0 });
}

function getCountdown(departure: string) {
  const diff = Math.max(0, Math.floor((new Date(departure).getTime() - Date.now()) / 1000));
  const min = Math.floor(diff / 60);
  const sec = diff % 60;
  return `${min}m ${sec}s`;
}

const DepartureBoard: React.FC<Props> = ({ selectedRoute, onError, language }) => {
  const { user } = useAuth();
  const [departures, setDepartures] = useState<any[]>([]);
  const [error, setError] = useState('');
  const [now, setNow] = useState(Date.now());
  const [bookingId, setBookingId] = useState<string | null>(null);
  const [bookingMsg, setBookingMsg] = useState('');
  const [bookingLoading, setBookingLoading] = useState('');

  useEffect(() => {
    if (!selectedRoute) return;
    fetchDepartures();
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
    // eslint-disable-next-line
  }, [selectedRoute]);

  const fetchDepartures = async () => {
    try {
      setError('');
      const res = await axios.get(`/api/schedules/route/${selectedRoute._id}`);
      setDepartures(res.data.data.schedules);
    } catch (e) {
      setError('Failed to fetch departures');
      onError('Failed to fetch departures');
    }
  };

  const handleBook = async (scheduleId: string) => {
    if (!user) return;
    setBookingLoading(scheduleId);
    setBookingMsg('');
    try {
      const res = await axios.post('/api/passenger/bookings', { scheduleId });
      setBookingId(res.data.data._id);
      setBookingMsg('Booking successful!');
    } catch (e: any) {
      setBookingMsg(e.response?.data?.message || 'Booking failed');
    } finally {
      setBookingLoading('');
    }
  };

  if (!selectedRoute) return null;

  return (
    <section className="bg-gray-800 rounded-lg p-4 mb-6">
      <h2 className="text-lg font-semibold mb-2">{labels[language].departures} - {selectedRoute.routeName}</h2>
      {error && <p className="text-red-400 text-sm mb-2">{error}</p>}
      {bookingMsg && <p className="text-green-400 text-sm mb-2">{bookingMsg}</p>}
      {departures.length === 0 ? (
        <p className="text-gray-400 text-sm">{labels[language].noDepartures}</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-gray-300">
                <th className="px-2 py-1 text-left">{labels[language].time}</th>
                <th className="px-2 py-1 text-left">{labels[language].fare}</th>
                <th className="px-2 py-1 text-left">{labels[language].seats}</th>
                <th className="px-2 py-1 text-left">{labels[language].travelTime}</th>
                <th className="px-2 py-1 text-left">{labels[language].countdown}</th>
                <th className="px-2 py-1 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {departures.map(dep => {
                const seatsLeft = dep.capacity - dep.passengerCount;
                return (
                  <tr key={dep._id} className="border-b border-gray-700">
                    <td className="px-2 py-1">{new Date(dep.departureTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
                    <td className="px-2 py-1">{formatKES(dep.fare)}</td>
                    <td className="px-2 py-1">{seatsLeft}</td>
                    <td className="px-2 py-1">{Math.round((new Date(dep.estimatedArrivalTime).getTime() - new Date(dep.departureTime).getTime()) / 60000)} min</td>
                    <td className="px-2 py-1 font-mono">{getCountdown(dep.departureTime)}</td>
                    <td className="px-2 py-1">
                      <button
                        className={`px-3 py-1 rounded bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium disabled:opacity-50 disabled:cursor-not-allowed`}
                        disabled={seatsLeft <= 0 || bookingLoading === dep._id}
                        onClick={() => handleBook(dep._id)}
                      >
                        {bookingLoading === dep._id ? 'Booking...' : seatsLeft <= 0 ? 'Full' : 'Book'}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
};

export default DepartureBoard; 
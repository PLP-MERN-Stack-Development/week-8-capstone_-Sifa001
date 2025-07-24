import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface Feedback {
  _id: string;
  passenger?: { name: string };
  route?: { routeName: string };
  rating: number;
  comment?: string;
  createdAt: string;
}

interface FeedbackListProps {
  driverId: string;
}

const FeedbackList: React.FC<FeedbackListProps> = ({ driverId }) => {
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        setLoading(true);
        setError('');
        const res = await axios.get(`/api/drivers/${driverId}/feedback`);
        setFeedback(res.data.data);
      } catch (err: any) {
        setError('Failed to load feedback');
      } finally {
        setLoading(false);
      }
    };
    fetchFeedback();
  }, [driverId]);

  return (
    <div className="bg-gray-900 rounded-md p-3 w-full">
      <h2 className="text-lg font-semibold mb-2">Passenger Feedback</h2>
      {loading ? (
        <div className="text-gray-400">Loading...</div>
      ) : error ? (
        <div className="text-red-400">{error}</div>
      ) : feedback.length === 0 ? (
        <div className="text-gray-400">No feedback yet.</div>
      ) : (
        <ul className="space-y-4 max-h-64 overflow-y-auto">
          {feedback.map(fb => (
            <li key={fb._id} className="bg-gray-900 rounded-md p-3 w-full">
              <div className="flex items-center justify-between mb-1">
                <span className="font-medium text-white text-base">{fb.passenger?.name || 'Anonymous'}</span>
                <span className="text-xs text-gray-400">{new Date(fb.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="text-sm text-gray-300 mb-1">Route: {fb.route?.routeName || 'N/A'}</div>
              <div className="flex items-center mb-1">
                {[1,2,3,4,5].map(i => (
                  <span key={i} className={i <= fb.rating ? 'text-yellow-400' : 'text-gray-600'}>★</span>
                ))}
                <span className="ml-2 text-gray-300">{fb.rating}/5</span>
              </div>
              {fb.comment && <div className="text-gray-200 text-sm italic">"{fb.comment}"</div>}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default FeedbackList; 
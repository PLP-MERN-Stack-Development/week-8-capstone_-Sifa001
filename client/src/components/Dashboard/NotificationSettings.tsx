import React, { useState } from 'react';

interface Props {
  language: 'en' | 'sw';
}

const labels = {
  en: {
    notifications: 'Notifications',
    enable: 'Enable route alerts',
    disable: 'Disable route alerts',
  },
  sw: {
    notifications: 'Arifa',
    enable: 'Washa arifa za njia',
    disable: 'Zima arifa za njia',
  },
};

const NotificationSettings: React.FC<Props> = ({ language }) => {
  const [enabled, setEnabled] = useState(false);
  return (
    <div className="w-full bg-gray-800 rounded-lg p-4 flex flex-col gap-4">
      <h2 className="text-lg font-semibold mb-2">Notification Settings</h2>
      <button
        className={`px-4 py-2 rounded font-bold text-white ${enabled ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'}`}
        onClick={() => setEnabled(e => !e)}
      >
        {enabled ? labels[language].disable : labels[language].enable}
      </button>
    </div>
  );
};

export default NotificationSettings; 
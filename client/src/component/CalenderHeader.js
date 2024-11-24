import React from 'react';
import { useAuth } from '../context/AuthContext';

export const CalendarHeader = () => {
  const { logout } = useAuth();

  return (
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-2xl font-bold">Calendar App</h1>
      <button
        onClick={logout}
        className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
      >
        Logout
      </button>
    </div>
  );
};
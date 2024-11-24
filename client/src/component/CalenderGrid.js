import React from 'react';

const DAYS_OF_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 
                'July', 'August', 'September', 'October', 'November', 'December'];

export const CalendarGrid = ({ selectedDate, onDateChange, events, onEventSelect }) => {
  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const getDaysArray = () => {
    const daysInMonth = getDaysInMonth(selectedDate);
    const firstDay = getFirstDayOfMonth(selectedDate);
    const days = Array(firstDay).fill(null);
    return [...days, ...Array.from({ length: daysInMonth }, (_, i) => i + 1)];
  };

  const getEventsForDay = (day) => {
    if (!day) return [];
    return events.filter(event => {
      const eventDate = new Date(event.startTime);
      return eventDate.getDate() === day &&
             eventDate.getMonth() === selectedDate.getMonth() &&
             eventDate.getFullYear() === selectedDate.getFullYear();
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-4 border-b">
        <div className="flex justify-between items-center">
          <button
            onClick={() => onDateChange(new Date(selectedDate.getFullYear(), selectedDate.getMonth() - 1))}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            Previous
          </button>
          <h2 className="text-xl font-bold">
            {MONTHS[selectedDate.getMonth()]} {selectedDate.getFullYear()}
          </h2>
          <button
            onClick={() => onDateChange(new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1))}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            Next
          </button>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-px bg-gray-200">
        {DAYS_OF_WEEK.map(day => (
          <div key={day} className="bg-gray-50 p-2 text-center font-bold">
            {day}
          </div>
        ))}
        {getDaysArray().map((day, index) => (
          <div
            key={index}
            className="bg-white min-h-24 p-2 border hover:bg-gray-50"
          >
            {day && (
              <>
                <div className="font-semibold">{day}</div>
                <div className="space-y-1">
                  {getEventsForDay(day).map(event => (
                    <div
                      key={event._id}
                      onClick={() => onEventSelect(event)}
                      className="text-sm p-1 bg-blue-100 rounded cursor-pointer truncate hover:bg-blue-200"
                    >
                      {event.title}
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
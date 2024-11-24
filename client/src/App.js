import React, { useState, useEffect } from 'react';
import { AuthProvider , useAuth } from './context/AuthContext';
import AuthForm from './component/AuthForm'
import { CalendarGrid } from './component/CalenderGrid';
import { EventModal } from './component/EventModal';
import { CalendarHeader } from './component/CalenderHeader';

const Calendar = () => {
  const [events, setEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showEventModal, setShowEventModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await fetch('http://localhost:4000/api/events', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      setEvents(data);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-6xl mx-auto">
        <CalendarHeader />
        <CalendarGrid
          selectedDate={selectedDate}
          onDateChange={setSelectedDate}
          events={events}
          onEventSelect={(event) => {
            setSelectedEvent(event);
            setShowEventModal(true);
          }}
        />
        <button
          onClick={() => {
            setSelectedEvent(null);
            setShowEventModal(true);
          }}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          Add Event
        </button>
        <EventModal
          isOpen={showEventModal}
          onClose={() => {
            setShowEventModal(false);
            setSelectedEvent(null);
          }}
          event={selectedEvent}
          onSubmit={async (eventData) => {
            try {
              const method = selectedEvent ? 'PUT' : 'POST';
              const url = selectedEvent 
                ? `http://localhost:4000/api/events/${selectedEvent._id}`
                : 'http://localhost:4000/api/events';

              const response = await fetch(url, {
                method,
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(eventData)
              });

              if (response.ok) {
                fetchEvents();
                setShowEventModal(false);
                setSelectedEvent(null);
              }
            } catch (error) {
              console.error('Error saving event:', error);
            }
          }}
        />
      </div>
    </div>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

const AppContent = () => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Calendar /> : <AuthForm />;
};

export default App;
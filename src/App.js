import './App.css';
import React, { useState } from 'react';
import AddEventForm from './components/AddEventForm';
import EventList from './components/EventList';

function App() {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleAdded = () => setRefreshKey((k) => k + 1);

  return (
    <div className="App">
      <div className="container py-4">
        <div className="d-flex align-items-center justify-content-between mb-4">
          <h1 className="h3 mb-0">Simple Events Client</h1>
          <small className="text-muted">A lightweight event viewer</small>
        </div>

        <div className="mb-4">
          <div className="card shadow-sm">
            <div className="card-body">
              <h2 className="h5">Add Event</h2>
              <AddEventForm onAdded={handleAdded} />
            </div>
          </div>
        </div>

        <div>
          <div className="card shadow-sm">
            <div className="card-body">
              <h2 className="h5">Events</h2>
              <EventList refreshKey={refreshKey} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;

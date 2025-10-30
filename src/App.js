import './App.css';
import React, { useState } from 'react';
import AddEventForm from './components/AddEventForm';
import EventList from './components/EventList';

function App() {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleAdded = () => setRefreshKey((k) => k + 1);

  return (
    <div className="App" style={{ padding: 24 }}>
      <h1>Simple Events Client</h1>
      <section style={{ marginBottom: 24 }}>
        <h2>Add Event</h2>
        <AddEventForm onAdded={handleAdded} />
      </section>

      <section>
        <h2>Events</h2>
        <EventList refreshKey={refreshKey} />
      </section>
    </div>
  );
}

export default App;

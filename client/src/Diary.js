import React, { useState, useEffect } from 'react';
import TripForm from './TripForm';
import TripCard from './TripCard';
import TripDetail from './TripDetail';
import './Diary.css';
import { useNavigate } from 'react-router-dom';

function Diary() {
  const [trips, setTrips] = useState([]);
  const [selectedTrip, setSelectedTrip] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTrips = async () => {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/trips', {
        headers: { Authorization: token },
      });
      const data = await response.json();
      setTrips(data);
    };
    fetchTrips();
  }, []);

  const addTrip = async (trip) => {
    const token = localStorage.getItem('token');
    const response = await fetch('http://localhost:5000/api/trips', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token,
      },
      body: JSON.stringify(trip),
    });
    const newTrip = await response.json();
    setTrips([...trips, newTrip]);
  };

  const deleteTrip = async (id) => {
    const token = localStorage.getItem('token');
    await fetch(`http://localhost:5000/api/trips/${id}`, {
      method: 'DELETE',
      headers: { Authorization: token },
    });
    setTrips(trips.filter((trip) => trip._id !== id));
  };

  const handleViewDetails = (trip) => {
    setSelectedTrip(trip);
  };

  const handleBackToList = () => {
    setSelectedTrip(null);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <div className='app-container'>
      <h1 className='app-title'>Travel Diary</h1>
      {!selectedTrip ? (
        <div className='main-container'>
          <div className='trip-form-section'>
            <button onClick={handleLogout} className='logout-button'>
              Logout
            </button>
          </div>
          <div className='trip-list-section'>
            <div className='your-trips-heading'>
              <h2>Your Trips</h2>
            </div>
            <div className='trip-list'>
              {trips.map((trip) => (
                <TripCard
                  key={trip._id}
                  trip={trip}
                  onViewDetails={() => handleViewDetails(trip)}
                  onDelete={() => deleteTrip(trip._id)}
                />
              ))}
            </div>
            <div className='trip-form-intro'>
              <p>Add New trip details using the following form:</p>
            </div>
            <TripForm addTrip={addTrip} />
          </div>
        </div>
      ) : (
        <TripDetail trip={selectedTrip} onBack={handleBackToList} />
      )}
    </div>
  );
}

export default Diary;

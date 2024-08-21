import React from 'react';
import './TripCard.css';

function TripCard({ trip, onViewDetails, onDelete }) {
  return (
    <div className='trip-card'>
      <img src={trip.coverImage} alt={trip.tripName} className='cover-image' />
      <div className='trip-info'>
        <h3>{trip.tripName}</h3>
        <p>{trip.tripDate}</p>
        <button className='view-button' onClick={onViewDetails}>
          View Details
        </button>
        <button className='view-button' onClick={onDelete}>
          Delete
        </button>
      </div>
    </div>
  );
}

export default TripCard;

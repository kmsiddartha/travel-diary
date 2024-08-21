import React from 'react';
import './TripDetail.css';

function TripDetail({ trip, onBack }) {
  return (
    <div className='trip-detail'>
      <button className='back-button' onClick={onBack}>
        Back to Trips
      </button>
      <h2>{trip.tripName}</h2>
      <p>{trip.tripDate}</p>
      <img src={trip.coverImage} alt={trip.tripName} className='cover-image' />
      <p>{trip.description}</p>
      <div className='trip-images'>
        {trip.tripImages.map((image, index) => (
          <img key={index} src={image} alt={`Trip image ${index + 1}`} />
        ))}
      </div>
    </div>
  );
}

export default TripDetail;

import React, { useState } from 'react';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from './firebase'; // Import Firebase storage
import './TripForm.css'; // Import the CSS file

function TripForm({ addTrip }) {
  const [tripName, setTripName] = useState('');
  const [tripDate, setTripDate] = useState('');
  const [coverImage, setCoverImage] = useState(null);
  const [tripImages, setTripImages] = useState([]);
  const [description, setDescription] = useState('');

  const handleCoverImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setCoverImage(file); // Store file for upload
    }
  };

  const handleTripImagesChange = (e) => {
    const files = Array.from(e.target.files);
    setTripImages(files); // Store files for upload
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Upload cover image
    let coverImageUrl = '';
    if (coverImage) {
      const coverImageRef = ref(storage, `covers/${coverImage.name}`);
      await uploadBytes(coverImageRef, coverImage);
      coverImageUrl = await getDownloadURL(coverImageRef);
    }

    // Upload trip images
    const tripImageUrls = [];
    for (const image of tripImages) {
      const tripImageRef = ref(storage, `trips/${image.name}`);
      await uploadBytes(tripImageRef, image);
      const url = await getDownloadURL(tripImageRef);
      tripImageUrls.push(url);
    }

    // Add trip with image URLs
    addTrip({
      tripName,
      tripDate,
      coverImage: coverImageUrl,
      tripImages: tripImageUrls,
      description,
    });

    // Reset form
    setTripName('');
    setTripDate('');
    setCoverImage(null);
    setTripImages([]);
    setDescription('');
  };

  return (
    <form className='trip-form' onSubmit={handleSubmit}>
      <div className='form-group'>
        <label htmlFor='tripName'>Trip Name</label>
        <input
          type='text'
          id='tripName'
          placeholder='Enter the trip name'
          value={tripName}
          onChange={(e) => setTripName(e.target.value)}
          required
        />
      </div>

      <div className='form-group'>
        <label htmlFor='tripDate'>Trip Date</label>
        <input
          type='date'
          id='tripDate'
          value={tripDate}
          onChange={(e) => setTripDate(e.target.value)}
          required
        />
      </div>

      <div className='form-group'>
        <label htmlFor='coverImage'>Cover Photo</label>
        <input
          type='file'
          id='coverImage'
          accept='image/*'
          onChange={handleCoverImageChange}
          required
        />
        {coverImage && (
          <img
            src={URL.createObjectURL(coverImage)}
            alt='Cover Preview'
            style={{ width: '100px', height: '100px', marginTop: '10px' }}
          />
        )}
      </div>

      <div className='form-group'>
        <label htmlFor='tripImages'>Trip Photos</label>
        <input
          type='file'
          id='tripImages'
          accept='image/*'
          multiple
          onChange={handleTripImagesChange}
        />
        {tripImages.length > 0 && (
          <div className='trip-images-preview'>
            {tripImages.map((image, index) => (
              <img
                key={index}
                src={URL.createObjectURL(image)}
                alt={`Trip Preview ${index}`}
                style={{ width: '100px', height: '100px', marginTop: '10px' }}
              />
            ))}
          </div>
        )}
      </div>

      <div className='form-group'>
        <label htmlFor='description'>Description</label>
        <textarea
          id='description'
          placeholder='Enter the trip description'
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
      </div>

      <button className='button-color' type='submit'>
        Add Trip
      </button>
    </form>
  );
}

export default TripForm;

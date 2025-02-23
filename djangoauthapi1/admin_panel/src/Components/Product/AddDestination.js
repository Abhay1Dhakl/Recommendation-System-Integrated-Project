import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AddDestination = () => {
  const [destinations, setDestinations] = useState([]);
  const [destination, setDestination] = useState({
    name: '',
    description: '',
    destination_type: '',
    activities: '',
    itinerary: [],
    inclusion: [],
    exclusion: [],
    image: null,
  });
  const [editMode, setEditMode] = useState(false);
  const [currentDestinationId, setCurrentDestinationId] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    axios.get('http://localhost:8000/api/user/destination/')
      .then(response => setDestinations(response.data))
      .catch(error => console.log('Error fetching destinations:', error));
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setDestination((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    setDestination((prev) => ({
      ...prev,
      image: e.target.files[0],
    }));
  };

  const handleAddArrayField = (field, e) => {
    const newArray = e.target.value.split('\n').map((line, index) => ({
      id: index + 1,
      description: line.trim(),
    })).filter(item => item.description !== '');
    setDestination((prev) => ({
      ...prev,
      [field]: newArray,
    }));
  };

  const validateForm = () => {
    if (!destination.name) return 'Name is required';
    if (!destination.description) return 'Description is required';
    if (!destination.destination_type) return 'Destination type is required';
    if (!destination.activities) return 'activity is required';
    if (destination.itinerary.length === 0) return 'At least one itinerary item is required';
    return null;
  };

  const handleAddDestination = () => {
    const validationError = validateForm();
    if (validationError) {
      setMessage(validationError);
      return;
    }

    const accessToken = localStorage.getItem("access_token");
    if (!accessToken) {
      setMessage('No access token found');
      return;
    }

    const formData = new FormData();
    formData.append('name', destination.name);
    formData.append('description', destination.description);
    formData.append('image', destination.image);
    formData.append('itinerary', JSON.stringify(destination.itinerary));
    formData.append('inclusion', JSON.stringify(destination.inclusion));
    formData.append('exclusion', JSON.stringify(destination.exclusion));
    formData.append('destination_type', destination.destination_type);
    formData.append('activities', destination.activities);

    const config = {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    };

    if (editMode) {
      axios.put(`http://localhost:8000/api/user/destination/${currentDestinationId}/update-destination/`, formData, config)
        .then(response => {
          setDestinations((prev) => prev.map(dest => dest.id === currentDestinationId ? response.data : dest));
          setEditMode(false);
          setCurrentDestinationId(null);
          setMessage('Destination updated successfully. You can now add a new destination.');
        })
        .catch(error => setMessage('Error updating destination.'));
    } else {
      axios.post('http://localhost:8000/api/user/destination/', formData, config)
        .then(response => {
          setDestinations((prev) => [...prev, response.data]);
          setMessage('Destination added successfully!');
        })
        .catch(error => setMessage('Error adding destination.'));
    }

    setDestination({ name: '', description: '', destination_type: '', activities: '', image: null, itinerary: [], inclusion: [], exclusion: [] });
  };

  const handleEditDestination = (destination) => {
    setDestination(destination);
    setEditMode(true);
    setCurrentDestinationId(destination.id);
    setMessage('');
  };

  const handleDeleteDestination = (id) => {
    const accessToken = localStorage.getItem("access_token");
    if (!accessToken) {
      setMessage('No access token found');
      return;
    }

    axios.delete(`http://localhost:8000/api/user/destination/${id}/delete-destination/`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
      .then(() => {
        setDestinations((prev) => prev.filter((dest) => dest.id !== id));
        setMessage('Destination deleted successfully!');
      })
      .catch((error) => setMessage('Error deleting destination.'));
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: 'auto', backgroundColor: '#f9f9f9', borderRadius: '10px' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>
        {editMode ? 'Edit Destination' : 'Add New Destination'}
      </h2>
      {message && <div style={{ color: 'green', marginBottom: '10px', textAlign: 'center' }}>{message}</div>}
      <form>
        <div style={{ marginBottom: '10px' }}>
          <input
            type="text"
            name="name"
            value={destination.name}
            onChange={handleInputChange}
            placeholder="Destination Name"
            style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ddd', fontSize: '16px' }}
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <textarea
            name="description"
            value={destination.description}
            onChange={handleInputChange}
            placeholder="Destination Description"
            style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ddd', fontSize: '16px', minHeight: '100px' }}
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <input
            type="text"
            name="destination_type"
            value={destination.destination_type}
            onChange={handleInputChange}
            placeholder="Destination Type"
            style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ddd', fontSize: '16px' }}
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <textarea
            name="activities"
            value={destination.activities}
            onChange={handleInputChange}
            placeholder="Activities (one item per line)"
            style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ddd', fontSize: '16px', minHeight: '100px' }}
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <textarea
            name="inclusion"
            value={destination.inclusion.map(item => item.description).join('\n')}
            onChange={(e) => handleAddArrayField('inclusion', e)}
            placeholder="Inclusion (one item per line)"
            style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ddd', fontSize: '16px', minHeight: '100px' }}
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <textarea
            name="exclusion"
            value={destination.exclusion.map(item => item.description).join('\n')}
            onChange={(e) => handleAddArrayField('exclusion', e)}
            placeholder="Exclusion (one item per line)"
            style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ddd', fontSize: '16px', minHeight: '100px' }}
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <textarea
            name="itinerary"
            value={destination.itinerary.map(item => item.description).join('\n')}
            onChange={(e) => handleAddArrayField('itinerary', e)}
            placeholder="Itinerary (one item per line)"
            style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ddd', fontSize: '16px', minHeight: '100px' }}
          />
        </div>
        <div style={{ marginBottom: '20px' }}>
          <input
            type="file"
            name="image"
            onChange={handleFileChange}
            style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ddd', fontSize: '16px' }}
          />
        </div>
        <button
          type="button"
          onClick={handleAddDestination}
          style={{ backgroundColor: '#4CAF50', color: 'white', padding: '10px 20px', fontSize: '16px', borderRadius: '5px', border: 'none', cursor: 'pointer' }}
        >
          {editMode ? 'Update Destination' : 'Add Destination'}
        </button>
      </form>
      <hr style={{ margin: '20px 0' }} />
      <h3 style={{ textAlign: 'center' }}>Destination List</h3>
      <ul style={{ listStyleType: 'none', padding: '0' }}>
        {destinations.map((dest) => (
          <li key={dest.id} style={{ marginBottom: '10px', padding: '10px', borderRadius: '5px', border: '1px solid #ddd' }}>
            <strong>{dest.name}</strong>
            <p>{dest.description}</p>
            <button onClick={() => handleEditDestination(dest)} style={{ marginRight: '10px', padding: '5px 10px', fontSize: '14px' }}>Edit</button>
            <button onClick={() => handleDeleteDestination(dest.id)} style={{ padding: '5px 10px', fontSize: '14px' }}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AddDestination;

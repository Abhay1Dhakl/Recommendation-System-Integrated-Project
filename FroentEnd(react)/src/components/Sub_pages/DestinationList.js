// src/components/DestinationsList.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const DestinationsList = () => {
    const [destinations, setDestinations] = useState([]);

    useEffect(() => {
        const fetchDestinations = async () => {
            try {
                const response = await axios.get('http://localhost:8000/api/user/destinations/');
                setDestinations(response.data);
            } catch (error) {
                console.error('Error fetching destinations:', error);
            }
        };

        fetchDestinations();
    }, []);

    return (
        <div>
            <h2>Destinations</h2>
            <ul>
                {destinations.map((destination) => (
                    <li key={destination.name}>
                        <Link to={`/destination/${destination.id}`}>{destination.name}</Link>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default DestinationsList;

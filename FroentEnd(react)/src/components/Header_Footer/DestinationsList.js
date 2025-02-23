import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import {
  Container,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Grid,
} from '@mui/material';

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
    <Container>
      <Typography variant="h4" gutterBottom align="center">
        Explore Destinations
      </Typography>
      <Grid container spacing={4}>
        {destinations.map((destination) => (
          <Grid item xs={12} sm={6} md={4} key={destination.id}>
            <Link to={`/destination/${destination.id}`} style={{ textDecoration: 'none' }}>
              <Card>
                <CardMedia
                  component="img"
                  height="200"
                  image={destination.image || 'https://via.placeholder.com/200'}
                  alt={destination.name}
                />
                <CardContent>
                  <Typography variant="h5">{destination.name}</Typography>
                  <Typography variant="body2" color="textSecondary">
                    {destination.description}
                  </Typography>
                  <Typography variant="body1" color="textPrimary">
                    Location: {destination.location}
                  </Typography>
                </CardContent>
              </Card>
            </Link>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default DestinationsList;

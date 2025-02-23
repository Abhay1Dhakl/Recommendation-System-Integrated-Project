import React, { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import axios from 'axios';


const Userpref = () => {
    const { destinationId } = useParams();  // Get dynamic destinationId from URL
    const [destinationDetails, setDestinationDetails] = useState(null);
    const location = useLocation();
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
// Example destinations data (this can be fetched from an API or database)
console.log(destinationId,destinations)
    // Set destination details based on URL
    useEffect(() => {
        if (destinationId && destinations[destinationId]) {
            setDestinationDetails(destinations[destinationId]);
        }
    }, [destinationId]);
    console.log("destination details", destinationDetails)
    // Send data to backend when destination details are available
    useEffect(() => {
        if (destinationDetails) {
            const page = location.pathname;

            const data = {
                page,
                destination: destinationDetails.name,
                type: destinationDetails.type,
                activities: destinationDetails.activities,
            };

            // Send data to the backend
            fetch("http://localhost:8000/api/user/track-page/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            }).then((response) => {
                if (response.ok) {
                    console.log("Page tracked successfully:", data);
                } else {
                    console.error("Failed to track page:", data);
                }
            });
        }
    }, [destinationDetails, location]);

    if (!destinationDetails) {
        return <div>Loading...</div>; // Show loading until destination data is available
    }

    return null; // This component doesn't render anything visible
};

export default Userpref;

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { useGetloggeduserQuery } from '../Serve/userAuthapi';
import { getToken } from '../Serve/LocalStorageService';
import { Link } from 'react-router-dom';
const Recommendations = () => {
  const [recommendations, setRecommendations] = useState([]);
  const [userData, setUserData] = useState([]);
  const dispatch = useDispatch();
  const { access_token } = getToken();
  const { data, isSuccess } = useGetloggeduserQuery(access_token);

  const [email, setEmail] = useState("");  // Store email as a simple string
  const [usersData, setUsersData] = useState({
    email: "",
    name: "",
  });

  // Fetch logged-in user data
  useEffect(() => {
    if (data && isSuccess) {
      setUsersData({
        email: data.email,
        name: data.name,
      });
      console.log("dash data:", data);
    }
  }, [data, isSuccess]);

  // Fetch user preferences
 
  useEffect(() => {
    const accessToken = localStorage.getItem("access_token");
    const fetchUserData = async () => {
      try {
        const userdata = await axios.get("http://127.0.0.1:8000/api/user/user-preferences/",{
        headers: {
          Authorization: `Bearer ${accessToken}`,
        }
        });
        console.log("users are data", userdata.data);
        setUserData(userdata.data);
      } catch (error) {
        console.error("Error fetching user preferences:", error);
      }
      console.log("users fetched data are",userData)
    };
    fetchUserData();
  }, []);

  // // Set email based on userData and usersData
  // useEffect(() => {
  //   const matchingUser = userData.find((user) => user.email === usersData.email);
  //   if (matchingUser) {
  //     setEmail(matchingUser.email);
  //   }
  // }, [userData, usersData]);

  // Fetch recommendations based on preferences
  useEffect(() => {
    const fetchRecommendations = async () => {

        const preferred_activities = [];
        const preferred_destination_types = [];
        console.log('users data inside',userData)
        
        preferred_activities.push(userData.preferred_activities);
        preferred_destination_types.push(userData.preferred_destination_types);
        
        try {
          const response = await fetch('http://127.0.0.1:8000/api/user/recommendations/', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              preferred_activities,
              preferred_destination_types,
            }),
          });

          if (response.ok) {
            const data = await response.json();
            setRecommendations(data);
            console.log("Fetched recommendations:", data);
          } else {
            console.error('Failed to fetch recommendations:', response.statusText);
          }
        } catch (error) {
          console.error('Error fetching recommendations:', error);
        }
    };
    

  
      fetchRecommendations();
 
  
  }, [userData]);  // Only re-run when `email` changes

  return (
    <div>
      <h1>Recommended Destinations</h1>
      {recommendations.length === 0 ? ( <p>No recommendations available at the moment.</p>
      ) : (
        <ul>
          {recommendations.map((destination) => (

            <>
             {/* <li key={destination.name}>
              <h3>{destination.name}</h3>
              <p>Type: {destination.destination_type}</p>
              <p>Activities: {Array.isArray(destination.activities) ? destination.activities.join(', ') : destination.activities}</p>
            </li>  */}
            <div className="card" style={{width: '18rem'}}>
              <div className="card-body">
                <h5 className="card-title">{destination.name}</h5>
                <p className="card-text">{destination.destination_type}</p>
                <p className="card-text">Activities: {Array.isArray(destination.activities) ? destination.activities.join(', ') : destination.activities}</p>
                <Link to={{
    pathname: `/${destination.name}`,
   
}}>
    Read More..
</Link>
              </div>
            </div>
            </>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Recommendations;

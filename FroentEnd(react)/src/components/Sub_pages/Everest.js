import React, { useState } from 'react'
import './Subpage.css'
import map from '../../components/Images/map.jpg'
import Navbar from '../Header_Footer/Navbar';
import Recommendations from '../Recommended Data/Recommendations';
import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useBookingMutation } from '../Serve/userAuthapi';
import { useDispatch } from 'react-redux';
import { TextField, Button, Box, Alert, Typography, CircularProgress } from '@mui/material';
import { useGetloggeduserQuery } from '../Serve/userAuthapi';
import axios from "axios"
import KhaltiCheckout from "khalti-checkout-web";
import config from '../Payment/KhaltiConfig';
import StarRating from './StarRating';
import { getToken } from '../Serve/LocalStorageService';
export default function Everest() {
	let checkout = new KhaltiCheckout(config);
	const { access_token } = getToken();
	const { data, isSuccess } = useGetloggeduserQuery(access_token);
	const [destinations, setDestinations] = useState([]);
	const [destination, setDestination] = useState(null);
	const [formData, setFormData] = useState({
		date: '',
		child: '',
		adult: '',
	  });
	  const [error, setError] = useState('');
		const [success, setSuccess] = useState('');
		const { id } = useParams(); 
	const today = new Date();
	console.log("access token is")
  console.log(data,isSuccess)
	const [usersData, setUsersData] = useState({
	  email: "",
	  name: "",
	});
	today.setDate(today.getDate() + 1); // Set to the next day
	const minDate = today.toISOString().split('T')[0]; // Format as YYYY-MM-DD
	const handleKhaltiPayment = () => {
		// Invoke the checkout logic here
		checkout.show({ amount: 1000 });
	  };
	  const handleChange = (e) => {
		// Extracting name and value from the event's target (the input field)
		const { name, value } = e.target;
	  
		// Updating the form data state
		setFormData((prevData) => ({
		  ...prevData, // Spread operator keeps all previous data (existing fields in the state)
		  [name]: value, // Dynamically updates the specific field that triggered the change
		}));
	  };
	  
	const[inc_exc, set_inc_exc] = useState([])
	const [userData, setUserData] = useState([])
	
	const [destinationData, setDestinationData] = useState([])
	const [itineraryData, set_itineraryData] = useState([])
	const [isLoading, setIsLoading] = useState(false);
	  
	useEffect(() => {
        if (data && isSuccess) {
          setUsersData({
            email: data.email,
            name: data.name,
          });
          console.log("dash data:", data);
        }
      }, [data, isSuccess]);
	  console.log("user data",usersData)
	useEffect(() => {
	 async function getalldata (){
		try{
			const userData = await axios.get("http://127.0.0.1:8000/api/user/everest_info/")
			console.log(userData.data)
			setUserData(userData.data)
		}catch(error){ 

		}
	 }
	 getalldata ()
	},[])
  
	useEffect(()=>{
		async function getData (){
			try{
				const userData = await axios.get('http://localhost:8000/api/user/destination/')
				setDestinationData(userData.data)
			}
			catch(error){

			}
		}
		getData()
	},[])
	useEffect(() => {
		async function getdata (){
		   try{
			   const itineraryData = await axios.get("http://127.0.0.1:8000/api/user/itinerary/")
			   console.log(itineraryData.data)
			   set_itineraryData(itineraryData.data)
		   }catch(error){ 
   
		   }
		}
		getdata ()
	   },[])

	   useEffect(() => {
		async function getdata_incexc (){
		   try{
			   const inc_exc = await axios.get("http://127.0.0.1:8000/api/user/everest_inc_exc/")
			   console.log(inc_exc.data)
			   set_inc_exc(inc_exc.data)
		   }catch(error){ 
   
		   }
		}
		getdata_incexc ()
	   },[])
	const [booking] = useBookingMutation();
	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!formData.date || !formData.child || !formData.adult) {
			setError('All fields are required.');
			setSuccess('');
			return;
		  }
		const data = new FormData(e.currentTarget);
		const actualData = {
			date: data.get('date'),
			child: data.get('child'),
			adult: data.get('adult'),

		}	
		/*if (res.error) {
			//console.log(typeof(res.error.data.errors))

			setServerError(res.error.data.errors)
		}
		if (res.data) {
			//console.log(typeof(res.data))
			console.log(res.data)
			storeToken(res.data.token)
			let { access_token } = getToken();
			dispatch(setUserToken({ access_token: access_token }))
			navigate('/')
		}*/
		try {
			setIsLoading(true); // Set loading state
			const res = await booking(actualData); // Async booking call
		
			if (res?.data) {
			  // On successful booking
			  setSuccess('Form submitted successfully!');
			  setError('');
			  setFormData({
				date: '',
				child: '',
				adult: '',
			  });
			} else {
			  // Handle API error
			  setError('Booking failed. Please try again.');
			  setSuccess('');
			}
		  } catch (error) {
			console.error('Booking Error:', error);
			setError('An unexpected error occurred. Please try again.');
			setSuccess('');
		  } finally {
			setIsLoading(false); // Always stop loading
		  }
	}
	// setTimeout(() => {
	// 	  setIsLoading(false);
	// 	  setError('There was an error submitting the form. Please try again.');
	// 	  setSuccess('');
	// 	}, 2000);


	

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
	// Get the 'id' from the URL
    const [selectedDestination, setSelectedDestination] = useState(null);
	useEffect(() => {
		// Find the destination that matches the id
		const matchedDestination = destinations?.find(
		  (dest) => dest.id === parseInt(id)
		);
		setDestination(matchedDestination);
	  }, [id, destinations]); // Re-run when `id` or `destinations` changes
	
	  if (!destination) {
		return <div>Loading...</div>;
	  }
	console.log(destination)

	const sendData = async () => {
		const actualData = {
			email: usersData.email,
			preferred_destination_types: destination.destination_type,
			preferred_activities: destination.activities,
		  }
		  console.log("actualdata", actualData)
		  const accessToken = localStorage.getItem("access_token");
		try {
		  const response = await axios.post('http://127.0.0.1:8000/api/user/preferences/', actualData,{
			headers: {
				Authorization: `Bearer ${accessToken}`, // Include the token for authentication
			  },
		  });
		  
		  console.log('Data sent successfully:', actualData);
		} catch (error) {
		  console.error('Error sending data:', error);
		}
	  };
	
	  // Call the function immediately
	  sendData();
	
	return (
		<div>
			<div className='wrapper'>
			<Navbar></Navbar>
			<div className="main">
				<div className="main-sec-2">
					<div className="heading">
						{/* <h1>{destination.name}</h1> */}
						<h1>{destination.name}</h1>
					</div>
					<div className="containt">

					</div>
					<Recommendations/>
					<h1 className="Map-overview">Map & OverView</h1>
					<div className="containts">
						<div className="subcontaint">
							<div className="column-1">
								<div className="items">
									<ul>
										<li>
											<div className="item">
												<span className="icon">
													<i className="fa fa-map-marker"></i>
												</span>
												<div className="text">
													<h6 className="info-title">Destination</h6>
													<h5 className="info">Nepal</h5>
												</div>
											</div>
										</li>
										<li>
											<div className="item">
												<span className="icon">
													<i className="fa fa-clock-o"></i>
												</span>
												<div className="text">
													<h6 className="info-title">Duration</h6>
													<h5 className="info">15 Days</h5>
												</div>
											</div>
										</li>
										<li>
											<div className="item">
												<span className="icon">
													<i className="fa fa-clock-o"></i>
												</span>
												<div className="text">
													<h6 className="info-title">Duration</h6>
													<h5 className="info">15 Days</h5>
												</div>
											</div>
										</li>

									</ul>
									<ul>
										<li>
											<div className="item-2">
												<span className="icon">
													<i className="fa fa-map-marker"></i>
												</span>
												<div className="text">
													<h6 className="info-title">Max Altitude</h6>
													<h5 className="info">5545 m</h5>
												</div>
											</div>
										</li>
										<li>
											<div className="item-1">
												<span className="icon">
													<i className="fa fa-bus"></i>
												</span>
												<div className="text">
													<h6 className="info-title">Vehicle</h6>
													<h5 className="info">Private Luxexry Tourist Bus And Aeroplane</h5>
												</div>
											</div>
										</li>

									</ul>
								</div>
							</div>
							<div className="map">
								{/* <img src={destination.image} /> */}
							</div>
						</div>
					</div>
					<div className="details">
						<input type="checkbox" id="check" />
						 <h1>About {destination.name}</h1><br /> 
						
						<div className="cont-1">
						<p>{destination.description}</p> 
						

						<br />

							<h1>Highlight of Everest Base Camp Trek </h1>
							<p>1. Hiking up to the Base Camp of the highest mountain in the world.</p>
							<p>2.Spectacular view of the mountain ranges such as Mount Everest, Mount Ama Dablam, Mount
								Thamserku, Mount
								Makalu, Mount Lhotse and many more.</p>
							<p>3.Exploring the Sagarmatha National Park, UNESCO world heritage site.</p>
							<p>4.Khumbu ice fall and glacier along the way to the Everest Base Camp.</p>
							<p>5.Exploring the oldest monastery of the Everest region, Tengboche Monastery.</p>
							<p>6.Exploring Sherpa communities.<br />
								Climb to Kala Patthar (5545 m) for Everest Sunrise and Sunset View.</p>
						</div>
						<label htmlFor="check">Readmore</label>
					</div>
					<br />
					<h1 className="EBC-iter">Itinerary of Everest Base Camp Treak</h1>
					{destination.itinerary.length > 0 ? (
  destination.itinerary.map((item, i) => (
    <div key={i}>
      <p>Day {i + 1}: {item.description}</p>
    </div>
  ))
) : (
  <p>No itinerary available for this destination.</p>
)}
					

					<br />
					<div className="inclusions">
						<h4><b>What's Included</b></h4>
						{destination.itinerary.length > 0 ? (
  destination.itinerary.map((item, i) => (
    <div key={i}>
      <p>Day {i + 1}: {item.description}</p>
    </div>
  ))
) : (
  <p>No itinerary available for this destination.</p>
)}
						<br />
						<h4><b>What's Not Included</b></h4>
						{destination.itinerary.length > 0 ? (
  destination.itinerary.map((item, i) => (
    <div key={i}>
      <p>Day {i + 1}: {item.description}</p>
    </div>
  ))
) : (
  <p>No itinerary available for this destination.</p>
)}
						
					</div>
				</div>
				<h1 id='demo'></h1>
				<aside className="main-sec-1">
					<div className='Sticky_side'>
					<div className="offer">
						<b>
							<h4 className="price">$1499</h4>
						</b>
						<p>Price based on group size and dates*</p>
						<hr />
						<Box component='form' noValidate sx={{ mt: 1 }} id='login-form' onSubmit={handleSubmit}>
							<TextField margin='normal' required fullWidth id='date' name='date' label='Submission Date' type='date' InputLabelProps={{
          shrink: true,
        }}
        inputProps={{
          min: minDate, // Set minimum date to tomorrow
        }}  value={formData.date} onChange={handleChange}/>
							<TextField margin='normal' required fullWidth id='child' name='child' label='child' type='number' value={formData.child} onChange={handleChange}/>
							<TextField margin='normal' required fullWidth id='adult' name='adult' label='adult' type='number'  value={formData.adult} onChange={handleChange} />
							<Box textAlign='center'>

								{isLoading ? <CircularProgress /> : <Button type='submit' variant='contained' sx={{ mt: 3, mb: 2, px: 5 }}>Book</Button>}

								{isLoading ? <CircularProgress /> : <Button type='button' variant='contained' sx={{ mt: 3, mb: 2, px: 5 }} onClick={handleKhaltiPayment}>Pay with khalti</Button>}
								{success && <Typography color="primary">{success}</Typography>}
							</Box>
						</Box>
						
						<hr />
						<div className="features">
							<span><i className="fa fa-check-circle"></i></span>
							<span>Best Price</span>
							<br />
							<span><i className="fa fa-check-circle"></i></span>
							<span>Secure Online Booking</span>
							<br />
							<span><i className="fa fa-check-circle"></i></span>
							<span>Extend Trip Without Charges</span>
							<br />
						</div>
					</div>
					</div>
				</aside>

			</div>
			<div className='star-rating'>
				<h1>Give rating</h1>
				<StarRating/>
			</div>
			</div>

		</div >
	)
}

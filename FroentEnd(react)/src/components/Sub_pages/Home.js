import React from 'react'
import Slider from '../Cards/Slider'
import AnimatedCard from "../Cards/AnimatedCard"
import Navbar from '../Header_Footer/Navbar';
import Recommendations from '../Recommended Data/Recommendations';
import UserPreference from '../UserPreferences/UserPreference';
import DestinationsList from './DestinationList';
import Userpref from '../UserPreferences/Userpref';
export default function Home() {
	return (
		<div>
			<Navbar />
			<Slider></Slider>
			<AnimatedCard />
			<Userpref/>
			<UserPreference/>
			<DestinationsList/>
		</div>
	)
}




import React from 'react'
import './NavbarCss.css'
/*<script>
const hamburger = document.querySelector(".hamburger");
const Navbar = document.querySelector(".Navbar");
hamburger.addEventListner("click", ()=>{
    hamburger.classNameList.toggle("active");

    Navbar.classNameList.toggle("active");
})
</script> */
import {Link} from 'react-router-dom';
import { getToken } from '../Serve/LocalStorageService';
import logo from '../Images/logo.png'
import SearchBar from '../Search/SearchBar';
import DestinationsList from './DestinationsList';
import { useEffect, useState } from 'react';
import axios from 'axios';

const Navbar = () =>{
    const {access_token} = getToken();
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

            <header>
                <div className="nav_logo">
                <a href="/" > <img src={logo} alt="..." height={100} width={200} /></a>
                </div>
                
                <input type="checkbox" id="menu-bar"/>
                    <label htmlFor="menu-bar">Menu</label>
                    <nav>
                        <ul>
                        <li><SearchBar/></li>
                            <li> <Link to="/" className="active">Home</Link> </li>
                            <li><a href="/">Services Offered</a>
                                <ul>
                                    <li><a href="/">Trekking With Me</a>
                                        <ul>
                                        {destinations.map((destination) => (
                    <li key={destination.name}>
                        <Link to={`/destination/${destination.id}`}>{destination.name}</Link>
                    </li>
                ))}
                {/* <li><Link to="/Annapurna" className="active">Annapurna</Link></li> */} 
                                        </ul>
                                    </li>
                                    <li><a href="/" className="active">Tour With Me</a></li>
                                    <li><a href="/" className="active">Spiritual Journey With Me</a></li>
                                    <li><a href="/" className="active">Short Hikings</a></li>
                                    <li><Link to="/Pokhara" className="active">Pokhara</Link>
                                    </li>
                                </ul>
                            </li>
                            <li>
                                <a href="/">Extended Service</a>
                            <ul>
                            <li>
                                <a href="/">Helicopter Tours</a>
                            </li>
                            <li>
                                
                                <a href="/">Sports Tours</a>
                            </li>
                            <li>
                                <a href="/">Peak Climbing</a>
                            </li>
                            <li> 
                                <a href="/">Mountain Flight</a>
                            </li>
                            <li> 
                                <a href="/">Rural Welfare Tour</a>
                            </li>
                            </ul>
                            </li>
                            <li> 
                                <a href="/">Blogs</a>
                            </li>
                            <li> 
                                <a href="/">About Me</a>
                            </li>
                            <li> 
                                <a href="/">Contact</a>
                            </li>
                            <li>
                                { access_token ? <Link to="./dashboard"><button className='button1'>Dashboard</button></Link> : <Link to="login"><button className='button1'>LOGIN</button></Link>}
                                
                            </li>
                           
                        </ul>

                    </nav>
            </header>

        </div >
    )
};
export default Navbar;


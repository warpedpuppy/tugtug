import React from 'react';
import './Home.css';
import {connect} from 'react-redux';
import Welcome from '../components/loginRegister/Welcome';
import HomeCanvas from '../components/HomeCanvas';

export default function Home () {
		return (
		  <div className='homePage'>
			  <HomeCanvas />
			  <Welcome />
	      </div>
	    );    
}
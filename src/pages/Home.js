import React from 'react';
import './Home.css';
import Welcome from '../components/loginRegister/Welcome';
//import HomeCanvas from '../components/HomeCanvas';
import GameCanvas from '../components/GameCanvas';
import ArtBoard from '../components/artBoard/ArtBoard';
import ArtBoardCanvas from '../components/artBoard/ArtBoardCanvas';
export default function Home () {
	return (
	  <div className='homePage'>
	  	  <GameCanvas />
		  <Welcome />
      </div>
    );    
}
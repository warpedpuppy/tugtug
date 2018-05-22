import React from 'react';
import './HomeCanvas.css';
import * as PIXI from 'pixi.js'
import Utils from '../animations/utils'
import home_page from '../animations/home_animation'
import {TimelineMax} from 'gsap';
import axios from 'axios';
export default class HomeCanvas extends React.Component {

	constructor(props){
		super(props);
		this.home_page = {};
	}
	componentDidMount(){
		this.home_page = home_page(Utils, PIXI, this.canvas, TimelineMax);
		this.home_page.Init();

		axios
		  .post('http://tugtugbackend.tahdr7ifjc.us-west-2.elasticbeanstalk.com/users')
		  .then(function (response) {
		    console.log(response);
		  })
		  .catch(function (error) {
		    console.log(error);
		  });

	}
	componentWillUnmount(){
		this.home_page.Stop();
	}
	render () {
		return (
			<div id='homeCanvas' ref={item => this.canvas = item} >
			</div>
		)
	}
	
}
import React from 'react';
import './HomeCanvas.css';
import * as PIXI from 'pixi.js'
import Utils from '../animations/utils'
import home_page from '../animations/intro_animation';
import {TimelineMax} from 'gsap';
import PixiFps from "pixi-fps";
export default class HomeCanvas extends React.Component {

	constructor(props){
		super(props);
		this.home_page = {};
	}
	componentDidMount(){
		this.home_page = home_page(Utils, PIXI, this.canvas, TimelineMax,PixiFps);
		this.home_page.init();
	}
	componentWillUnmount(){
		//this.home_page.stop();

	}
	render () {
		return (
			<div id='homeCanvas'></div>
		)
	}
}
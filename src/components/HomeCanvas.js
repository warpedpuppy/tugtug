import React from 'react';
import './HomeCanvas.css';
import * as PIXI from 'pixi.js'
import Utils from '../animations/utils'
import home_page from '../animations/home_animation'
import {TimelineMax} from 'gsap';
export default class HomeCanvas extends React.Component {

	constructor(props){
		super(props);
		this.home_page = {};
	}
	componentDidMount(){
		this.home_page = home_page(Utils, PIXI, this.canvas, TimelineMax);
		this.home_page.Init();
	}
	componentWillUnmount(){
		this.home_page.Stop();
	}
	render () {
		return (
			<div id='homeCanvas' ref={item => this.canvas = item} >ain't got canvas ability!</div>
		)
	}
	
}
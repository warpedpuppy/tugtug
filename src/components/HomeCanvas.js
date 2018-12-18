import React from 'react';
import './HomeCanvas.css';
import * as PIXI from 'pixi.js'
import Utils from '../animations/utils'
import home_page from '../animations/intro_animation';
import filter_animation from '../animations/supportingClasses/filterAnimation';
import ripples from '../animations/supportingClasses/ripples';
import pellets from '../animations/supportingClasses/pellets';
import hero from '../animations/supportingClasses/hero';
import magicPills from '../animations/supportingClasses/magicPills';
import { TimelineMax } from 'gsap';
import PixiFps from "pixi-fps";
export default class HomeCanvas extends React.Component {

	constructor(props){
		super(props);
		this.home_page = {};
		this.testFilter = this.testFilter.bind(this);
		this.state = {
			filterTest: "off",
			nightMode: "off"
		}
	}
	componentDidMount(){
		let obj = {
			 TimelineMax,
			 PixiFps, 
			 filter_animation, 
			 ripples,
			 pellets,
			 hero,
			 magicPills
		}
		this.home_page = home_page(PIXI, Utils, obj);
		this.home_page.init();
	}
	componentWillUnmount(){
		this.home_page.stop();
	}
	testFilter () {
		this.home_page.filterTest();
		if(this.state.filterTest === "off") {
			this.setState({filterTest: "on"})
		} else { 
			this.setState({filterTest: "off"})
		}
	}
	nightMode () {
		this.home_page.nightMode();
		if(this.state.nightMode === "off") {
			this.setState({nightMode: "on"})
		} else { 
			this.setState({nightMode: "off"})
		}
	}
	render () {
		let backgroundCSS = (this.state.nightMode === "off")?'waterBackground':'nightBackground';
		return (
			<div>
			<div id='homeCanvas' className={backgroundCSS} ></div>
			<div className="testPanel">
			<button onClick={() => this.testFilter()}>filter test is {this.state.filterTest}</button>
			<button onClick={() => this.nightMode()}>night mode {this.state.nightMode}</button>
			</div>
			</div>
		)
	}
}
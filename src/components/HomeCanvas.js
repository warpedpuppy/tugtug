import React from 'react';
import './HomeCanvas.css';
import * as PIXI from 'pixi.js'
import Utils from '../animations/utils'
import home_page from '../animations/intro_animation';
import filter_animation from '../animations/intro_supporting/filterAnimation';
import {TimelineMax} from 'gsap';
import PixiFps from "pixi-fps";
export default class HomeCanvas extends React.Component {

	constructor(props){
		super(props);
		this.home_page = {};
		this.testFilter = this.testFilter.bind(this);
		this.state = {
			filterTest: "off"
		}
	}
	componentDidMount(){
		this.home_page = home_page(Utils, PIXI, this.canvas, TimelineMax,PixiFps, filter_animation);
		this.home_page.init();
	}
	componentWillUnmount(){
		//this.home_page.stop();

	}
	testFilter () {
		this.home_page.filterTest();
		if(this.state.filterTest === "off") {
			this.setState({filterTest: "on"})
		} else { 
			this.setState({filterTest: "off"})
		}
	}
	render () {
		return (
			<div>
			<div id='homeCanvas'></div>
			<div class="testPanel">
			<button onClick={() => this.testFilter()}>filter test is {this.state.filterTest}</button>

			</div>
			</div>
		)
	}
}
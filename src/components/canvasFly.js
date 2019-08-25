import React from 'react';
import './HomeCanvas.css';
import FlyAnimation from '../animations/flyAnimation';
import {isMobile, isMobileOnly} from 'react-device-detect';
export default class HomeCanvas extends React.Component {

	constructor(props){
		super(props);
		this.home_page = {};
		this.testFilter = this.testFilter.bind(this);
		//this.loggedInCheck = this.loggedInCheck.bind(this);
		this.pauseGame = this.pauseGame.bind(this)
		this.state = {
			filterTest: "off",
			nightMode: "off",
			loggedIn: true,
			showStartScreen: true
		}
		
	}
	componentDidMount () {
		if (this.state.loggedIn) {
			this.home_page = FlyAnimation();
			this.home_page.init(isMobile, isMobileOnly);
		}
	}
	startGame = () => {
		this.setState({showStartScreen: false})
		this.home_page.startGame();
	}
	pauseGame (bool) {
		if (this.home_page.pause) {
			this.home_page.pause(bool)
		}

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
	leftHit (e) {
		e.preventDefault()
		console.log("left down")
		this.home_page.keyHandler.leftHit(e);
	}
	rightHit (e) {
		this.home_page.keyHandler.rightHit(e);
	}
	spaceHit (e) {
		this.home_page.keyHandler.spaceHit(e);
	}
	mouseUpHandler (e) {
		console.log("mouse up")
		//this.home_page.keyHandler.keyUp(e);
	}
	nightMode () {
		this.home_page.nightMode();
		if(this.state.nightMode === "off") {
			this.setState({nightMode: "on"})
		} else { 
			this.setState({nightMode: "off"})
		}
	}
	switchPlayer () {
		this.home_page.switchPlayer();
	}
	render () {
			this.pauseGame(this.props.action)
			let canvasClass = (isMobile)?"canvasParent isMobileOnly":"canvasParent";
			return (
				<div className={canvasClass}>
					<div id='homeCanvas'></div>
				</div>

			)
	}
}
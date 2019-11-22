import React from 'react';
import './HomeCanvas.css';
import './CanvasFly.css';
import FlyAnimation from '../animations/flyAnimation';
import {isMobile, isMobileOnly} from 'react-device-detect';
import SiteContext from '../SiteContext';
import AllGrids from '../pages/Admin/AllMazes/AllGrids';

export default class HomeCanvas extends React.Component {

	constructor(props){
		super(props);
		this.home_page = {};
		this.testFilter = this.testFilter.bind(this);
		this.pauseGame = this.pauseGame.bind(this)
		this.state = {
			filterTest: "off",
			nightMode: "off",
			loggedIn: true,
			showStartScreen: true
		}
		
	}
	static contextType = SiteContext;
	componentDidMount () {
		
		this.context.mazeGameHandler(true);
		this.home_page = FlyAnimation();
		console.log("build maze ", this.context.activeMazeId)
		this.home_page.init(isMobile, isMobileOnly, this.context.activeMazeId);

	
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
		this.context.mazeGameHandler(false);
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

			if (!this.context.inGameMazeEdit) {
				return (
					<div className={canvasClass}>
						<div id='homeCanvas' className="flyCanvas"></div>
					</div>
	
				)
			} else {
				return (
					<div className={canvasClass}>
						<div id='homeCanvas' className="flyCanvas"></div>
						<div className="inGameAllGrids"><AllGrids /></div>
					</div>
				)
			}
			
	}
}
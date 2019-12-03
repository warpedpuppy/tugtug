import React from 'react';
import './HomeCanvas.css';
import './CanvasFly.css';
import FlyAnimation from '../animations/flyAnimation';
import {isMobile, isMobileOnly} from 'react-device-detect';
import SiteContext from '../SiteContext';
import AllGrids from '../pages/Admin/AllMazes/AllGrids';
class CanvasFly extends React.Component {

	constructor(props){
		super(props);
		this.fly_anim = {};
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
		
		this.context.mazeGameHandler('fly');
		this.fly_anim = FlyAnimation();
		this.fly_anim.init(isMobile, isMobileOnly, this.context.activeMazeId, this);

	
	}
	redirectHome = () => {
		this.props.history.push('/');
	}
	startGame = () => {
		this.setState({showStartScreen: false})
		this.fly_anim.startGame();
	}
	pauseGame (bool) {
		if (this.fly_anim.pause) {
			this.fly_anim.pause(bool)
		}

	}
	componentWillUnmount(){
		this.context.mazeGameHandler('');
		this.fly_anim.stop();
	}
	testFilter () {
		this.fly_anim.filterTest();
		if(this.state.filterTest === "off") {
			this.setState({filterTest: "on"})
		} else { 
			this.setState({filterTest: "off"})
		}
	}
	leftHit (e) {
		e.preventDefault()
		console.log("left down")
		this.fly_anim.keyHandler.leftHit(e);
	}
	rightHit (e) {
		this.fly_anim.keyHandler.rightHit(e);
	}
	spaceHit (e) {
		this.fly_anim.keyHandler.spaceHit(e);
	}
	mouseUpHandler (e) {
		console.log("mouse up")
		//this.fly_anim.keyHandler.keyUp(e);
	}
	nightMode () {
		this.fly_anim.nightMode();
		if(this.state.nightMode === "off") {
			this.setState({nightMode: "on"})
		} else { 
			this.setState({nightMode: "off"})
		}
	}
	changeGrid (id) {
		if (this.fly_anim.changeGrid && (id !== this.fly_anim.id)) {
			let obj = this.context.mazes.find( maze => maze.id === id);
			this.fly_anim.changeGrid(obj)
		}
	}
	switchPlayer () {
		this.fly_anim.switchPlayer();
	}
	render () {
		
			this.pauseGame(this.context.mazeGameAction)

			let canvasClass = (isMobile)?"canvasParent isMobileOnly":"canvasParent";

			if (!this.context.inGameMazeEdit) {
				return (
					<div className={canvasClass}>
						<div id='homeCanvas' className="flyCanvas"></div>
					</div>
	
				)
			} else {
				this.changeGrid(this.context.activeMazeId)
				return (
					<div className={canvasClass}>
						<div id='homeCanvas' className="flyCanvas"></div>
						<div className="inGameAllGrids"><AllGrids /></div>
					</div>
				)
			}
			
	}
}

export default CanvasFly;
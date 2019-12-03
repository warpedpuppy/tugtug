import React from 'react';
import './HomeCanvas.css';
import swim_game from '../animations/swimAnimation';
import {isMobile, isMobileOnly} from 'react-device-detect';
import SiteContext from '../SiteContext';
import AllGrids from '../pages/Admin/AllMazes/AllGrids';
export default class HomeCanvas extends React.Component {
	static contextType = SiteContext;
	constructor(props){
		super(props);
		this.swim_game = {};
		this.testFilter = this.testFilter.bind(this);
		this.loggedInCheck = this.loggedInCheck.bind(this);
		this.state = {
			filterTest: "off",
			nightMode: "off",
			loggedIn: true,
			showStartScreen: true
		}
		
	}
	redirectHome = () => {
		this.props.history.push('/');
	}
	pauseGame (bool) {
		if (this.swim_game.pause) {
			this.swim_game.pause(bool)
		}

	}
	componentDidMount () {
		this.context.mazeGameHandler('swim');
		this.swim_game = swim_game();
		this.swim_game.init(isMobile, isMobileOnly, this.context.activeMazeId, this);

	}
	startGame = () => {
		this.setState({showStartScreen: false})
		this.swim_game.startGame();
	}
	componentWillUnmount(){
		this.context.mazeGameHandler('');
		this.swim_game.stop();
	}
	loggedInCheck () {
		this.setState({loggedIn:true})
		this.swim_game = swim_game();
		this.swim_game.init(isMobile, isMobileOnly);
	}
	changeGrid (id) {
		if (this.swim_game.changeGrid && (id !== this.swim_game.id)) {
			let obj = this.context.mazes.find( maze => maze.id === id);
			this.swim_game.changeGrid(obj)
		}
	}
	testFilter () {
		this.swim_game.filterTest();
		if(this.state.filterTest === "off") {
			this.setState({filterTest: "on"})
		} else { 
			this.setState({filterTest: "off"})
		}
	}
	nightMode () {
		this.swim_game.nightMode();
		if(this.state.nightMode === "off") {
			this.setState({nightMode: "on"})
		} else { 
			this.setState({nightMode: "off"})
		}
	}
	switchPlayer () {
		this.swim_game.switchPlayer();
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
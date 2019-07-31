import React from 'react';
import './HomeCanvas.css';
import home_page from '../animations/allFour_animation';
import {isMobile, isMobileOnly} from 'react-device-detect';

export default class HomeCanvas extends React.Component {

	constructor (props) {
		super(props);
		this.home_page = {};
		this.testFilter = this.testFilter.bind(this);
		this.loggedInCheck = this.loggedInCheck.bind(this);
		this.state = {
			filterTest: "off",
			nightMode: "off",
			loggedIn: true,
			showStartScreen: true
		}
		
	}
	componentDidMount () {
		if (this.state.loggedIn) {
			this.home_page = home_page();
			this.home_page.init(isMobile, isMobileOnly);
		}
	}
	componentWillMount () {
		this.getGameData();
	}
	startGame = () => {
		this.setState({showStartScreen: false})
		this.home_page.startGame();
	}
	componentWillUnmount(){
		this.home_page.stop();
	}
	loggedInCheck () {
		this.setState({loggedIn:true})
		this.home_page = home_page();
		this.home_page.init(isMobile, isMobileOnly);
		// this.start_canvas = start_canvas();
		// this.start_canvas.init(this.startGame);
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
	switchPlayer () {
		this.home_page.switchPlayer();
	}
	render () {
		let startScreenCSS = (this.state.showStartScreen)?'':'startScreenHide';
		return (
			<div>
			<div id='startGameCanvas' className={startScreenCSS} ></div>
			<button 
				onClick={() => this.props.closeGame()} 
				className='closeButton'
				></button>
			<div id='homeCanvas'></div>
			<h1 id="testOrientation">orientation</h1>
			</div>
		)
	}
}
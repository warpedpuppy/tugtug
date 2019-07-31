import React from 'react';
import './HomeCanvas.css';
import TempLogIn from './loginRegister/tempLogin';
import home_page from '../animations/jumpAnimation';
import {isMobile, isMobileOnly} from 'react-device-detect';
export default class HomeCanvas extends React.Component {

	constructor(props){
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
		// this.test = viewPortSize();
		// this.test.init()
		
		if (this.state.loggedIn) {
			this.home_page = home_page();
			this.home_page.init(isMobile, isMobileOnly);
			
			// this.start_canvas = start_canvas();
			// this.start_canvas.init(this.startGame);
		}
		
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
		if (this.state.loggedIn) {
			return (
				<div>
				<div id='startGameCanvas' className={startScreenCSS} ></div>
				<div id='homeCanvas'></div>
				<button onClick={() => this.props.closeGame()} className='closeButton'></button>
				</div>
			)
		} else {
			return (
				<div>
				<TempLogIn loggedInFunction={this.loggedInCheck}/>
				</div>
			)
		}
		
	}
}
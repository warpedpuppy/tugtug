import React from 'react';
import './HomeCanvas.css';
import TempLogIn from './loginRegister/tempLogin';
import home_page from '../animations/intro_animation';
//import viewPortSize from '../animations/viewportSize';
//import start_canvas from '../animations/startGameAnimation';
import {isMobile, isMobileOnly} from 'react-device-detect';

import axios from 'axios';
import {API_BASE_URL} from '../config';
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
	componentWillMount () {
		
		this.getGameData();
	}
	getGameData () {
		// console.log('get game data')
		// let that = this;
		// axios
	 //      .get(`${API_BASE_URL}/admin/gameLoadGrids`)
	 //      .then(response => {
	 //      	console.log('home canvas response = ', response)
	 //       	//that.buildGrid(response.data.board)
	 //      })
	 //      .catch((err) => {
	 //        console.error(err)
	 //      });  
		// let that = this;
		// return axios.get(`${API_BASE_URL}/api/users`)
		//   .then(function(response){
		//   	//that.startGame(response.data);
		//   })
		//   .catch((err) => {
		//   	//console.log(err)
		//   });  
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
		// if (isMobileOnly) {
		// 	return (
		// 		<div className="mobileOnlyApology">
		// 			<h1>please view this content on either an ipad or a computer!</h1>
		// 		</div>
		// 	)
		// } else 

		if (this.state.loggedIn) {
			return (
				<div>
				<div id='startGameCanvas' className={startScreenCSS} ></div>
				<button onClick={() => this.props.closeGame()} className='closeButton'>close</button>
				<div id='homeCanvas'></div>
				<h1 id="testOrientation"></h1>
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
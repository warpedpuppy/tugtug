import React from 'react';
import './GameCanvas.css';
import * as PIXI from 'pixi.js';
import Utils from '../animations/utils/utils';
import game_code from '../animations/game_animation';
import art_board_code from '../animations/supportingClasses/art_board_sub';
import portal_code from '../animations/supportingClasses/portal';
import hero from '../animations/supportingClasses/hero';
import PanelsBoard from '../animations/supportingClasses/panelsBoard';
import pellets from '../animations/supportingClasses/pellets';
import ripples from '../animations/supportingClasses/ripples';
import Panel from '../animations/supportingClasses/panel';
import filter_animation from '../animations/supportingClasses/filterAnimation';
import magicPills from '../animations/supportingClasses/magicPills';

import {connect} from 'react-redux';
import axios from 'axios';
import {API_BASE_URL} from '../config';
import faker from 'faker';
import { TweenMax } from 'gsap';
import PixiFps from "pixi-fps";

class GameCanvas extends React.Component {
	constructor(props){
		super(props);
		this.game = {};
		this.getUserData = this.getUserData.bind(this);
		this.state = {
		    background: '#fff',
		    panelVisible: false,
		    panelButtonText: "see panel",
		    filterTest: "off"
		  };
		this.supportingClasses = {
			art_board_code,
			portal_code,
			PanelsBoard,
			PixiFps,
			Panel,
			TweenMax,
			hero,
			pellets,
			ripples,
			filter_animation,
			magicPills
		}

	}
	getUserName () {
		return faker.name.firstName();
	}
	getUserData () {
		let that = this;
		return axios.get(`${API_BASE_URL}/api/users`)
		  .then(function(response){
		  	that.startGame(response.data);
		  })
		  .catch((err) => {
		  	console.log(err)
		  });  
	}
	componentWillMount () {
		this.getUserData();
		console.log("GET USER DATA")
	}
	startGame(data){


		let lsToken = localStorage.getItem('token');
		axios.get(`${API_BASE_URL}/store/artBoard`,{ headers: {"Authorization" : `Bearer ${lsToken}`} })
		.then(result => {
			console.log("THE GET ENDPOINT HIT")
			let boardArray = result.data.board;
		})


		console.log('data = ', data)
		if(this.props.testMode){
			// change data to non database
			data = {users: [{
				username: this.props.username,
				firstName: this.props.firstName,
				lastName: this.props.lastName,
				email: this.props.email,
				items: this.props.items
			}]}
		}
		data.items = this.props.items;
		console.log('data = ', data)
		this.game = game_code(PIXI, Utils, this.supportingClasses, data, this.getUserName, TweenMax);
		this.game.init();
		//this.game.update(this.props.items);
		this.editMode = this.props.editMode;
		
	}
	componentWillUnmount(){
		if(this.game.stop)this.game.stop();
	}
	componentDidUpdate(){
		this.game.changeColor(this.props.color);
		// console.log('this is the color'+this.props.color);
		//console.log('edit mode = '+this.props.editMode.toString())

		if(this.editMode !== this.props.editMode){
			this.game.editMode(this.props.editMode);
			this.editMode = this.props.editMode;
		}

		
	}
	testFilter () {
		this.game.filterTest();
		if(this.state.filterTest === "off") {
			this.setState({filterTest: "on"})
		} else { 
			this.setState({filterTest: "off"})
		}
	}
	render () {
		return (
			<div>
			<div id='game_canvas'></div>
			{/*
			<div className="testPanel">
			<button onClick={() => this.testFilter()}>filter test is {this.state.filterTest}</button>
			</div>
		*/}
			</div>
		)
	}
	
}

export const mapStateToProps = state => ({
    items: state.avatarReducer.items,
    color: state.themeReducer.color,
    editMode: state.themeReducer.editMode,
    testMode: state.tokenReducer.testMode,
    username: state.tokenReducer.username,
    firstName: state.tokenReducer.firstName,
    lastName: state.tokenReducer.lastName,
    email: state.tokenReducer.email
});

export default connect(mapStateToProps)(GameCanvas);

import React from 'react';
import './GameCanvas.css';
import * as PIXI from 'pixi.js';
import Utils from '../animations/utils';
import game_code from '../animations/game_animation';
import art_board_code from '../animations/supportingClasses/art_board_sub';
import portal_code from '../animations/supportingClasses/portal';
import hero from '../animations/intro_supporting/hero';
import keyHandler from '../animations/supportingClasses/keyHandler';
//import ripples from '../animations/supportingClasses/ripples';
import Panel from '../animations/supportingClasses/panel';
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
		    panelButtonText: "see panel"
		  };
		this.supportingClasses = {
			art_board_code,
			portal_code,
			keyHandler,
			PixiFps,
			Panel,
			TweenMax,
			hero
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
	}
	startGame(data){
		
		if(this.props.testMode){
			// change data to non database
			data = {users: [{
				username: this.props.username,
				firstName: this.props.firstName,
				lastName: this.props.lastName,
				email: this.props.email
			}]}
		}

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
		console.log('edit mode = '+this.props.editMode.toString())

		if(this.editMode !== this.props.editMode){
			this.game.toggleAvi(this.props.editMode);
			this.editMode = this.props.editMode;
		}
		
	}

	render () {
		return (
			<div>
			<div id="game_canvas"></div>
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

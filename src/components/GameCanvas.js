import React from 'react';
import './GameCanvas.css';
import * as PIXI from 'pixi.js'
import Utils from '../animations/utils'
import game_code from '../animations/game_animation'
export default class GameCanvas extends React.Component {
	constructor(props){
		super(props);
		this.game = {};
	}
	componentDidMount(){
		this.game = game_code(PIXI, Utils);
		this.game.init();
	}
	componentWillUnmount(){
		this.game.stop();
	}
	render () {
		return (
			<div id="game_canvas"></div>
		)
	}
	
}
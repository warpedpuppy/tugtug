import React from 'react';
import './GameCanvas.css';
import * as PIXI from 'pixi.js'
import Utils from '../animations/utils'
import game_code from '../animations/game_animation'
import {connect} from 'react-redux';
class GameCanvas extends React.Component {
	constructor(props){
		super(props);
		this.game = {};
	}
	componentDidMount(){

		this.game = game_code(PIXI, Utils);
		this.game.init();
		this.game.update(this.props.items);
	}
	componentWillUnmount(){

		this.game.stop();
	}
	componentDidUpdate(){
		this.game.update(this.props.items);
	}
	render () {
		return (
			<div id="game_canvas"></div>
		)
	}
	
}

export const mapStateToProps = state => ({
    items: state.avatarReducer.items
});

export default connect(mapStateToProps)(GameCanvas);

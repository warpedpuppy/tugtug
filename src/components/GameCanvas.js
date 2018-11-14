import React from 'react';
import './GameCanvas.css';
import * as PIXI from 'pixi.js'
import Utils from '../animations/utils'
import game_code from '../animations/game_animation'
import art_board_code from '../animations/supportingClasses/art_board_sub'
import {connect} from 'react-redux';
class GameCanvas extends React.Component {
	constructor(props){
		super(props);
		this.game = {};
		this.state = {
		    background: '#fff',
		    panelVisible: false,
		    panelButtonText: "see panel"
		  };
	}
	componentDidMount(){

		this.game = game_code(PIXI, Utils, art_board_code);
		this.game.init();
		this.game.update(this.props.items);
	}
	componentWillUnmount(){
		this.game.stop();
	}
	componentDidUpdate(){
		this.game.changeColor(this.props.color);
		console.log('this is the color'+this.props.color);
		console.log('edit mode = '+this.props.editMode.toString())
		this.game.toggleAvi(this.props.editMode);
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
    editMode: state.themeReducer.editMode
});

export default connect(mapStateToProps)(GameCanvas);

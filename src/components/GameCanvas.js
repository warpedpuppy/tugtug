import React from 'react';
import './GameCanvas.css';
import * as PIXI from 'pixi.js'
import Utils from '../animations/utils'
import game_code from '../animations/game_animation'
import art_board_code from '../animations/supportingClasses/art_board_sub'
import {connect} from 'react-redux';
import { SketchPicker } from 'react-color';
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
		this.game.update(this.props.items);
	}
	handleChangeComplete = (color) => {
		this.game.changeColor(color);
	 	// this.art_board.changeColor(color);
	     this.setState({ background: color.hex });

	 }
	seePanel () {
		let newText = (this.state.panelButtonText === "see panel")?"hide panel":"see panel";
		 this.setState({ 
		 	panelVisible: !this.state.panelVisible,
		 	panelButtonText: newText
		 });
		 this.game.toggleAvi();
	}
	render () {
		let panelClass = (this.state.panelVisible)?"show":"hide";
		let classString = `${panelClass} colorPickerPanel`;
		return (
			<div>
			<div id="game_canvas"></div>
			<SketchPicker 	
			className={classString}
			color={ this.state.background }
			onChangeComplete={ this.handleChangeComplete }
			/>
    		<button className="button colorPickerButton" onClick={ e => this.seePanel() }>{this.state.panelButtonText}</button>
    		</div>
		)
	}
	
}

export const mapStateToProps = state => ({
    items: state.avatarReducer.items
});

export default connect(mapStateToProps)(GameCanvas);

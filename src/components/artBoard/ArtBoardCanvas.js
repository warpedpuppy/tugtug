import React from 'react';
import './ArtBoardCanvas.css';
import * as PIXI from 'pixi.js'
import Utils from '../../animations/utils'
import {connect} from 'react-redux';
import art_board_js from '../../animations/art_board_canvas'

class ArtBoardCanvas extends React.Component {
	
	constructor(props){
		super(props);
		this.art_board = {};
	}
	componentDidMount(){
		this.art_board = art_board_js(Utils, PIXI);
		this.art_board.init();
	}
	componentWillUnmount(){
		this.art_board.stop();
	}
	render () {
		return (
			<div className="cont"><h1>canvas</h1>
			<div 
			id="art_board_canvas" 
			></div>
			<div id="results2"></div>
			</div>
		)
	}
	
}



export default connect()(ArtBoardCanvas);

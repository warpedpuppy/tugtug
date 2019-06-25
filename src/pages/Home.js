import React from 'react';
import './Home.css';
import Welcome from '../components/loginRegister/Welcome';
import HomeCanvas from '../components/HomeCanvas';
import CanvasJump from '../components/canvasJump';
import CanvasFly from '../components/canvasFly';
import CanvasSwim from '../components/canvasSwim';
//import HomeCanvas from '../components/homeCanvas';
//import HomeCanvas from '../components/ThreeOfAKindTestCanvas';

import { connect } from 'react-redux';
import { changePage } from '../actions/themeActions.js';

class Home extends React.Component {

	constructor (props) {
		super(props);
		this.closeGame = this.closeGame.bind(this);
		this.state = {
			active: undefined
		}
	}
	componentWillMount () {
		console.log('home mounting');
		this.props.dispatch(changePage());

	}
	changeState (e) {
		e.preventDefault();
		this.setState({active: e.target.innerHTML})
		
	}
	closeGame () {
		this.setState({active: undefined})
	}

	render () {

		if (!this.state.active) {
			return (
			<div className="homeMenuButtonDiv" >
				<button className="homeMenuButton" onClick={ e => this.changeState(e)}>fly</button>
				<button className="homeMenuButton" onClick={ e => this.changeState(e)}>swim</button>
				<button className="homeMenuButton" onClick={ e => this.changeState(e)}>jump</button>
				<button className="homeMenuButton" onClick={ e => this.changeState(e)}>all three</button>
			</div>
			)
		} else if(this.state.active === 'jump') {
			return (
			  <div className='homePage'>
			  	  <CanvasJump closeGame={this.closeGame} />
				  <Welcome />
		      </div>
		    );    
		} else if(this.state.active === 'fly') {
			return (
			  <div className='homePage'>
			  	  <CanvasFly  closeGame={this.closeGame}  />
				  <Welcome />
		      </div>
		    );    
		} else if(this.state.active === 'swim') {
			return (
			  <div className='homePage'>
			  	  <CanvasSwim  closeGame={this.closeGame} />
				  <Welcome />
		      </div>
		    );    
		} else if(this.state.active === 'all three') {
			return (
			  <div className='homePage'>
			  	  <HomeCanvas  closeGame={this.closeGame} />
				  <Welcome />
		      </div>
		    );    
		}
	
	}
	
}

export const mapStateToProps = state => ({
    page: state.themeReducer.page
});
export default connect(mapStateToProps)(Home);
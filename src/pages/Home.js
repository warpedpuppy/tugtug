import React from 'react';
import './Home.css';
import Welcome from '../components/loginRegister/Welcome';
import HomeCanvas from '../components/HomeCanvas';
import CanvasJump from '../components/canvasJump';
import canvasFly from '../components/canvasFly';
import canvasSwim from '../components/canvasSwim';
//import HomeCanvas from '../components/ThreeOfAKindTestCanvas';

import { connect } from 'react-redux';
import { changePage } from '../actions/themeActions.js';

class Home extends React.Component {

	constructor (props) {
		super(props);
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

	render () {

		if (!this.state.active) {
			return (
			<div>
				<button onClick={ e => this.changeState(e)}>fly</button>
				<button onClick={ e => this.changeState(e)}>swim</button>
				<button onClick={ e => this.changeState(e)}>jump</button>
			</div>
			)
		} else if(this.state.active === 'jump') {
			return (
			  <div className='homePage'>
			  	  <CanvasJump />
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
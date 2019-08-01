import React from 'react';
import './Home.css';
import HomeCanvas from '../components/HomeCanvas';
import CanvasJump from '../components/canvasJump';
import CanvasFly from '../components/canvasFly';
import CanvasSwim from '../components/canvasSwim';
import SideMenu from '../components/sideMenu';
import { connect } from 'react-redux';
import { changePage } from '../actions/themeActions.js';

class Home extends React.Component {

	constructor (props) {
		super(props);
		this.closeGame = this.closeGame.bind(this);
		this.changeState = this.changeState.bind(this);
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

		//destroy game instance
		
	}
	closeGame () {
		this.setState({active: undefined})
	}

	render () {

		let activeCanvas = "";
		if(this.state.active === 'jump') {
			  activeCanvas = <CanvasJump closeGame={this.closeGame} />   
		} else if(this.state.active === 'fly') {
			  activeCanvas = <CanvasFly  closeGame={this.closeGame}  />  
		} else if(this.state.active === 'swim') {
			  activeCanvas = <CanvasSwim  closeGame={this.closeGame} />
		} else if(this.state.active === 'all three') {
			  activeCanvas = <HomeCanvas  closeGame={this.closeGame} />
		}

		return (
			<div className="homeCont">
				<SideMenu changeState={this.changeState}/>
				{ activeCanvas }
			</div>
		)
	
	}
	
}

export const mapStateToProps = state => ({
    page: state.themeReducer.page
});
export default connect(mapStateToProps)(Home);
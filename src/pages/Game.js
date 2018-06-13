import React from 'react';
import GameCanvas from '../components/GameCanvas';
import { connect } from 'react-redux';
import { closeMenu } from '../actions/themeActions.js';

class Game extends React.Component {

	componentDidMount(){
		this.props.dispatch(closeMenu())
	}
	render () {
		return (
		<GameCanvas />
		)
	}
	
}

export const mapStateToProps = state => ({
    menuOpen: state.themeReducer.menuOpen
});
export default connect(mapStateToProps)(Game);
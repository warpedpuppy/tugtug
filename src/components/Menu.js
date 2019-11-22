import React from 'react';
import { Link } from 'react-router-dom';
import './Menu.css';
import SiteContext from '../SiteContext';
import Button from 'react-bootstrap/Button';

export default class Menu extends React.Component {

	static contextType = SiteContext;
	state = {buttonText: "choose / create maze"}

	chooseMaze = (e) => {
		e.preventDefault();
		this.setState({buttonText: (this.state.buttonText === "resume")? "choose / create maze" : "resume"})
		this.context.setInGameMazeEdit(!this.context.inGameMazeEdit);
		this.context.setMazeGameAction(!this.context.mazeGameAction);
	}

	render() {
		if (!this.context.mazeGame) {
			return (
				<div>
					<nav id="primary-nav">
						<Link to="/">home</Link>
						<Link to="/games">games</Link>
						<Link to="/admin">admin</Link>
					</nav>
				</div>
			);
		} else {
			return (
				<div>
					<nav id="primary-nav">
						<Link to="/">home</Link>
						<Button onClick={this.chooseMaze}>{ this.state.buttonText }</Button>
						<Link to="/games">exit</Link>
					</nav>
				</div>
			);
		}
	   
	  }
}





import React from 'react';
import { Link } from 'react-router-dom';
import './Menu.css';
import SiteContext from '../SiteContext';
import Button from 'react-bootstrap/Button';

export default class Menu extends React.Component {

	static contextType = SiteContext;
	state = {buttonText: "choose maze"}

	chooseMaze = (e) => {
		e.preventDefault();
		this.setState({buttonText: (this.state.buttonText === "resume")? "choose maze" : "resume"})
		this.context.setInGameMazeEdit(!this.context.inGameMazeEdit);
		this.context.setMazeGameAction(!this.context.mazeGameAction);
	}

	render() {
		if (!this.context.mazeGame) {
			return (
				<nav id="primary-nav">
					<div className="logo"><Link to="/">tugtug</Link></div>
					<div className="nav-links">
						<Link to="/">home</Link>
						<Link to="/games">games</Link>
						<Link to="/admin">admin</Link>
					</div>
				</nav>
			);
		} else {
			return (
				<nav id="primary-nav">
					<div className="logo"><Link to="/">tugtug</Link></div>
					<div className="nav-links">
						<Link to="/">home</Link>
						<Button size="sm" onClick={this.chooseMaze}>{ this.state.buttonText }</Button>
						<Link to="/games">exit</Link>
						</div>
				</nav>
			);
		}
	   
	  }
}





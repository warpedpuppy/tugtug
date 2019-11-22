import React from 'react';
import { Link } from 'react-router-dom';
import './Menu.css';
import SiteContext from '../SiteContext';
import Button from 'react-bootstrap/Button';

export default class Menu extends React.Component {

	static contextType = SiteContext;
	//state = {chooseBuildMaze: false}

	chooseMaze = (e) => {
		e.preventDefault();
		//this.setState({chooseBuildMaze: true})
		this.context.setInGameMazeEdit(true);
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
						<Button onClick={this.chooseMaze}>choose / create maze</Button>
						<Link to="/games">exit</Link>
					</nav>
				</div>
			);
		}
	   
	  }
}





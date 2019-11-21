import React from 'react';
import { Link } from 'react-router-dom';
import './Menu.css';
import SiteContext from '../SiteContext';
export default class Menu extends React.Component {

	static contextType = SiteContext;

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
						<Link to="/admin">choose / create maze</Link>
						<Link to="/games">exit</Link>
					</nav>
				</div>
			);
		}
	   
	  }
}





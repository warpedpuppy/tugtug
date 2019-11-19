import React from 'react';
import { Link } from 'react-router-dom';
import './Menu.css';

export default class Menu extends React.Component {
	  render() {
	    return (
			<div>
				<nav id="primary-nav">
					<Link to="/">home</Link>
					<Link to="/games">games</Link>
					<Link to="/admin">admin</Link>
				</nav>
			</div>
	    );
	  }
}





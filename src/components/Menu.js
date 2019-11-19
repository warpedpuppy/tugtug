import React from 'react';
import { Link } from 'react-router-dom';
import './Menu.css';

export default class Menu extends React.Component {
	
	  constructor(props) {
		super(props);
	  }
	  render() {
	    return (
			<div>
				<nav>
					<Link to="/">home</Link>
					<Link to="/games">games</Link>
					<Link to="/admin">admin</Link>
				</nav>
			</div>
	    );
	  }
}





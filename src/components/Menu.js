import React from 'react';
import { Link } from 'react-router-dom';
import './Menu.css';
import SiteContext from '../SiteContext';
import { withRouter } from 'react-router-dom';
class Menu extends React.Component {

	static contextType = SiteContext;
	state = {
		//buttonText: "choose maze", 
		dropDown: false
	}
	goto = (url) => {
		this.props.history.push(url);
		this.setState({dropDown: false})
	}
	chooseMaze = (e) => {
		e.preventDefault();
		//this.setState({buttonText: (this.context.inGameMazeEdit)? "choose maze" : "resume"})
		this.context.setInGameMazeEdit(!this.context.inGameMazeEdit);
		this.context.setMazeGameAction(!this.context.mazeGameAction);
	}
	hamburgerClickHandler = (e) => {
		this.setState({dropDown: !this.state.dropDown})
	}
	render() {
		let text = (this.context.inGameMazeEdit)?  "resume game" : "choose maze" ;
		if (this.context.game === '') {
			let classRef = (this.state.dropDown)?'change':'';
			return (
				<nav id="primary-nav">
					<div className="logo"><Link to="/">tugtug</Link></div>
					<div className="dropdown-screen"></div>
					<div className={`nav-links ${classRef}`}>
						<span onClick={() => this.goto("/admin")}>admin</span>
					</div>
					<div className="hamburger" onClick={this.hamburgerClickHandler}>
						<span className={classRef}></span>
						<span className={classRef}></span>
						<span className={classRef}></span>
					</div>
				</nav>
			);
		} else if (this.context.game === 'swim' || this.context.game === 'fly') {
			return (
				<nav id="primary-nav">
					<div className="logo"><Link to="/">tugtug</Link></div>
					<div className="nav-links">
						<span onClick={this.chooseMaze}>{ text }</span>
						<span onClick={() => this.goto("/")}>exit</span>
					</div>
				</nav>
			);
		} else if (this.context.game === 'jump' || this.context.game === 'admin' ) {
			return (
				<nav id="primary-nav">
					<div className="logo"><Link to="/">tugtug</Link></div>
				</nav>
			);
		}
	   
	  }
}

export default withRouter(Menu)


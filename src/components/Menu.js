import React from 'react';
import { Link } from 'react-router-dom';
import './Menu.css';
import SiteContext from '../SiteContext';
import { withRouter } from 'react-router-dom';
class Menu extends React.Component {

	static contextType = SiteContext;
	state = {
		buttonText: "choose maze", 
		dropDown: false
	}
	goto = (url) => {
		this.props.history.push(url);
		this.setState({dropDown: false})
	}

	chooseMaze = (e) => {
		e.preventDefault();
		this.setState({buttonText: (this.state.buttonText === "resume")? "choose maze" : "resume"})
		this.context.setInGameMazeEdit(!this.context.inGameMazeEdit);
		this.context.setMazeGameAction(!this.context.mazeGameAction);
	}
	hamburgerClickHandler = (e) => {
		this.setState({dropDown: !this.state.dropDown})
	}
	render() {
		if (!this.context.mazeGame) {
			let classRef = (this.state.dropDown)?'change':'';
			return (
				<nav id="primary-nav">
					<div className="logo"><Link to="/">tugtug</Link></div>
					<div className="dropdown-screen"></div>
					<div className={`nav-links ${classRef}`}>
						<span onClick={() => this.goto("/")}>home</span>
						<span onClick={() => this.goto("/graphic-novel")}>graphic novel layouts</span>
						<span onClick={() => this.goto("/games")}>games</span>
						<span onClick={() => this.goto("/admin")}>admin</span>
					</div>
					<div className="hamburger" onClick={this.hamburgerClickHandler}>
						<span className={classRef}></span>
						<span className={classRef}></span>
						<span className={classRef}></span>
					</div>
				</nav>
			);
		} else {
			return (
				<nav id="primary-nav">
					<div className="logo"><Link to="/">tugtug</Link></div>
					<div className="nav-links">
						<span size="sm" onClick={this.chooseMaze}>{ this.state.buttonText }</span>
						<span onClick={() => this.goto("/games")}>exit</span>
						</div>
				</nav>
			);
		}
	   
	  }
}

export default withRouter(Menu)


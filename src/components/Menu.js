import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './Menu.css';
import TugTug from '../svgs/TugTug.svg';
import LogoGraphic from './LogoGraphic';
import LoginRegisterContainer from './loginRegister/LoginRegisterContainer';

export default class Menu extends Component {
	  constructor(props) {
		super(props);
		this.toggleLogin = this.toggleLogin.bind(this);
		this.state = {
			showDropDown:false, 
			showLogin: false
		}
	  }
	  toggleLogin (e) {
	  	e.preventDefault();
	    this.setState({
	      showLogin: !this.state.showLogin,
	      showDropDown: false
	    })
	  }
	  showDropDown(e){
	  	this.setState({
	  		showDropDown: !this.state.showDropDown
	  	})
	  }
	  hideDropDown(e){
	  	this.setState({
	  		showDropDown: false
	  	})
	  }
	  render() {

	  	let showDropDownClass = (this.state.showDropDown)?'open':'';
	  	let raiseGraphic = (this.state.showDropDown)?'raised':'';
	  	let classes = `logoGraphic ${raiseGraphic}`;
	    return (
			<div>
				<nav>
					<div className="not-links">
						<Link className="homeLink" to="/">
							<LogoGraphic passedClasses={classes}/>
							<img src={TugTug} alt="tugtug" />
							</Link>
						<div className="hamburger" onClick={() => this.showDropDown()}>
							<span></span>
							<span></span>
							<span></span>
						</div>
					</div>
					<div className={`links  ${showDropDownClass}`}>
						<Link to="/" onClick={() => this.hideDropDown()}>
						<span>home</span>
						</Link>
						<Link to="/game" onClick={() => this.hideDropDown()}>
						<span>game</span>
						</Link>
						<Link to="/about" onClick={() => this.hideDropDown()}>
						<span>about</span>
						</Link>
					</div>
					
				</nav>
				<LoginRegisterContainer toggleLogin={this.toggleLogin} showLogin={this.state.showLogin} />
			</div>
	    );
	  }
}

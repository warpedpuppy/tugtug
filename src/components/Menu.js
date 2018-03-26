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
			showLogin: true
		}
	  }
	  toggleLogin (e) {
	  	e.preventDefault();
	    this.setState({
	      showLogin: !this.state.showLogin
	    })
	  }
	  showDropDown(e){
	  	this.setState({
	  		showDropDown: !this.state.showDropDown
	  	})
	  }
	  render() {

	  	let showDropDownClass = (this.state.showDropDown)?'open':'';
	  	let raiseGraphic = (this.state.showDropDown)?'raised':'';
	  	let classes = `logoGraphic ${raiseGraphic}`;
	  	console.log('raisegraphic = ',classes)
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
						<a onClick={(e) => this.toggleLogin(e)} >
						<span>login/register</span>
						</a>
						<Link to="/about">
						<span>about</span>
						</Link>
						<Link to="/contact">
						<span>contact</span>
						</Link>
					</div>
					
				</nav>
				<LoginRegisterContainer toggleLogin={this.toggleLogin} showLogin={this.state.showLogin} />
			</div>
	    );
	  }
}

import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './Menu.css';
import TugTug from '../svgs/TugTug.svg';
import LogoGraphic from './LogoGraphic';
import LoginRegisterContainer from './loginRegister/LoginRegisterContainer';
import { deleteToken } from '../actions/tokenActions.js';
import { connect } from 'react-redux';
import Welcome from './loginRegister/Welcome';

class Menu extends Component {
	  constructor(props) {
		super(props);
		this.toggleLogin = this.toggleLogin.bind(this);
		this.logOut = this.logOut.bind(this);
		this.state = {
			showDropDown:false, 
			showLogin: false
		}
	  }
	  toggleLogin (e) {
	  	if(e){
	  		e.preventDefault();
	  	}
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
  	  logOut (e) {
		e.preventDefault();
		this.props.dispatch(deleteToken());
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
	  	let showLogin = (this.props.token === 'blank')?'':'hide';
	  	let showLogOut = (this.props.token === 'blank')?'hide':'';

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
						<Link className={showLogOut} to="/game" onClick={() => this.hideDropDown()}>
						<span>game</span>
						</Link>
						<Link to="/about" onClick={() => this.hideDropDown()}>
						<span>about</span>
						</Link>
						<a className={showLogin} onClick={this.toggleLogin}>login/register</a>
						<a className={showLogOut} onClick={this.logOut}>log out</a>
					</div>
					
				</nav>
				<Welcome />
				<LoginRegisterContainer 
					toggleLogin={this.toggleLogin} 
					showLogin={this.state.showLogin}
				/>
			</div>
	    );
	  }
}

export const mapStateToProps = state => ({
    token: state.tokenReducer.token
});

export default connect(mapStateToProps)(Menu);

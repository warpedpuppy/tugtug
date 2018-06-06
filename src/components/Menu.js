import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import './Menu.css';
import TugTug from '../svgs/TugTug.svg';
import LogoGraphic from './LogoGraphic';
import LoginRegisterContainer from './loginRegister/LoginRegisterContainer';
import { deleteToken } from '../actions/tokenActions.js';
import { deleteAll } from '../actions/avatarActions.js';
import { connect } from 'react-redux';


class Menu extends Component {
	  constructor(props) {
		super(props);
		this.toggleLogin = this.toggleLogin.bind(this);
		this.logOut = this.logOut.bind(this);
		this.state = {
			showDropDown:false, 
			showLogin: false,
			redirect: false
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
		this.setState({redirect: true})
		this.props.dispatch(deleteAll());
		// delete all content in avatar reducer

		// delete all 
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
	  	let redirect = (this.state.redirect && window.location.pathname !== '/')?<Redirect to='/' />:''; 

	    return (
			<div>
				{redirect}
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
						
						<Link className={showLogOut} to="/game" onClick={() => this.hideDropDown()}>
						<span>game</span>
						</Link>
						<Link className={showLogOut} to="/store" onClick={() => this.hideDropDown()}>
						<span>store</span>
						</Link>
						<a className={showLogin} onClick={this.toggleLogin}>login/register</a>
						<a className={showLogOut} onClick={this.logOut}>log out</a>
					</div>
					
				</nav>
				
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

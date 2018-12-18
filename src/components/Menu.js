import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import './Menu.css';
import TugTug from '../svgs/TugTug.svg';
import LogoGraphic from './LogoGraphic';
import LoginRegisterContainer from './loginRegister/LoginRegisterContainer';
import { deleteToken, testUser } from '../actions/tokenActions.js';
import { deleteAll } from '../actions/avatarActions.js';
import { toggleMenu, closeMenu } from '../actions/themeActions.js';
import { connect } from 'react-redux';
import EditMode from './editMode';
import axios from 'axios';
import {API_BASE_URL} from '../config';

class Menu extends Component {
	
	  constructor(props) {
		super(props);
		this.toggleLogin = this.toggleLogin.bind(this);
		this.hideDropDownAndLogin = this.hideDropDownAndLogin.bind(this);
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
	  	this.props.dispatch(toggleMenu());
	    this.setState({
	      showDropDown: false,
	      showLogin: true
	    })
	  }
	  showDropDown(e){
	  	this.props.dispatch(toggleMenu());
	  	this.setState({
	  		showDropDown: !this.state.showDropDown
	  	})
	  }
  	  logOut (e) {
		e.preventDefault();
		this.props.dispatch(deleteToken());
		this.setState({redirect: true})
		this.props.dispatch(deleteAll());
		this.props.dispatch(closeMenu());
	  }
	  hideDropDownAndLogin(e){
	  	if(e){
	  		e.preventDefault();
	  	}
	  	this.props.dispatch(closeMenu());
	  	this.setState({ showLogin: false })
	  }
	  testUser (e) {

		let that = this;
		e.preventDefault();
		return axios.post(`${API_BASE_URL}/api/auth/testUser`)
		  .then(function(response){
		  	console.log('authToken = ', response.data.authToken)
		  	let userData = {
		  	    username: "Testy",
                firstName: "Testy",
                lastName: "McTesterson",
                email: "testy@tugtug.com"
            }
		    that.props.dispatch(testUser(response.data.authToken, userData, true));
		  })
		  .catch((err) => {
		  	console.error('error = ', err)
		  });  

	}
	  
	  render() {

	  	let showDropDownClass = (this.props.menuOpen)?'open':'';
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
						
						<Link className={showLogOut} to="/game">
						<span>game</span>
						</Link>
						<Link className={showLogOut} to="/store">
						<span>store</span>
						</Link>
						<a className={showLogin} onClick={e => this.testUser(e)} >enter as a test user</a>
						<a className={showLogin} onClick={this.toggleLogin}>login/register</a>
						<a className={showLogOut} onClick={this.logOut}>log out</a>
						<EditMode />
					</div>
					 
				</nav>
				
				<LoginRegisterContainer 
					hideDropDownAndLogin={this.hideDropDownAndLogin} 
					showLogin={this.state.showLogin}
				/>
			</div>
	    );
		
	  }
}

export const mapStateToProps = state => ({
    token: state.tokenReducer.token,
    menuOpen: state.themeReducer.menuOpen
});



// function mapDispatchToProps(dispatch){
//     return bindActionCreators({
//         openMenu, toggleMenu, closeMenu, deleteToken, deleteAll}, dispatch);
// }






export default connect(mapStateToProps)(Menu);









import React from 'react';
import "./LoginRegisterContainer.css";
import CloseButton from '../../svgs/closeButton.svg'
import LoginForm from './LoginForm'
import Register from './Register'
import { deleteToken } from '../../actions/tokenActions.js';
import {connect} from 'react-redux';
class LoginRegisterContainer extends React.Component {

	constructor(props){
		super(props);
		this.toggleForms = this.toggleForms.bind(this);
		this.logOut = this.logOut.bind(this);
		this.state = {
			login: true,
			register:false
		}
	}
	logOut (e) {
		e.preventDefault();
		this.props.dispatch(deleteToken());
	}
	toggleForms (e){
		e.preventDefault();
		this.setState({
			login: !this.state.login,
			register: !this.state.register
		})
	}

	render(){
		let loginClass = (!this.state.login)?{display: 'none'}:{};
		let registerClass = (!this.state.register)?{display: 'none'}:{};
		if(this.props.showLogin) {
			return (
				<div className="LoginRegisterContainerDiv">
				<div className="LoginRegisterContainer">
				<div>token: {this.props.token.substr(0,5)}</div>
					<button
					onClick={(e) => this.logOut(e)}
					>
					LOG OUT
					</button>
					<button 
					className="closeButton" 
					onClick={(e) => this.props.toggleLogin(e)} 
					>
					<img 
					src={CloseButton} 
					alt="close button" 
					/></button>
					<LoginForm styleProp={loginClass} />
					<Register styleProp={registerClass} />
					<a onClick={(e) => this.toggleForms(e)} style={loginClass} >need to register?</a>
					<a onClick={(e) => this.toggleForms(e)} style={registerClass} >need to login?</a>
				</div>
				</div>
			)
		} else {
			return (
				<div></div>
			)
		}
	}
}

export const mapStateToProps = state => ({
    token: state.tokenReducer.token
});

export default connect(mapStateToProps)(LoginRegisterContainer);
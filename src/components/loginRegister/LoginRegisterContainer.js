
import React from 'react';
import "./LoginRegisterContainer.css";
import CloseButton from '../../svgs/closeButton.svg'
import LoginForm from './LoginForm'
import Register from './Register'
export default class LoginRegisterContainer extends React.Component {

	constructor(props){
		super(props);
		this.toggleForms = this.toggleForms.bind(this);
		this.state = {
			login: false,
			register:true
		}
	}
	toggleForms (e){
		e.preventDefault();
		this.setState({
			login: !this.state.login,
			register:!this.state.register
		})
	}

	render(){
		let loginClass = (!this.state.login)?{display: 'none'}:{};
		let registerClass = (!this.state.register)?{display: 'none'}:{};
		if(this.props.showLogin) {
			return (
				<div className="LoginRegisterContainerDiv">
				<div className="LoginRegisterContainer">
					<button className="closeButton" onClick={(e) => this.props.toggleLogin(e)} ><img src={CloseButton} /></button>
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

import React from 'react';
import "./LoginRegisterContainer.css";
import CloseButton from '../../svgs/closeButton.svg';
import LoginForm from './LoginForm';
import Register from './Register';
import Processing from './Processing';
export default class LoginRegisterContainer extends React.Component {

	constructor(props){
		super(props);
		this.toggleForms = this.toggleForms.bind(this);
		
		this.state = {
			login: true,
			register:false,
			processing:false
		}
	}
	processing (bool) {
		this.setState({
			processing: bool
		})
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
				<div className="centerShell">
				<div className="LoginRegisterContainerDiv">
				<Processing processing={this.state.processing} />
				<div className="LoginRegisterContainer">
					<button 
					className="closeButton" 
					onClick={(e) => this.props.toggleLogin(e)} 
					>
					<img 
					src={CloseButton} 
					alt="close button" 
					/></button>
					<LoginForm
					styleProp={loginClass} 
					closeWindow={(e) => this.props.toggleLogin(e)} 
					processing={(bool) => this.processing(bool)}
					/>
					<Register 
					styleProp={registerClass} 
					processing={(bool) => this.processing(bool)}
					/>
					<a onClick={(e) => this.toggleForms(e)} style={loginClass} >need to register?</a>
					<a onClick={(e) => this.toggleForms(e)} style={registerClass} >need to login?</a>
				</div>
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

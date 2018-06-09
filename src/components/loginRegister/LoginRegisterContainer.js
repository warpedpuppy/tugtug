
import React from 'react';
import "./LoginRegisterContainer.css";
import {bindActionCreators} from 'redux';
import CloseButton from '../../svgs/closeButton.svg';
import LoginForm from './LoginForm';
import Register from './Register';
import Processing from './Processing';
import axios from 'axios';
import { addToken, addUserdata } from '../../actions/tokenActions.js';
import {API_BASE_URL} from '../../config';
import {connect} from 'react-redux';
import { addItems } from '../../actions/avatarActions.js';

class LoginRegisterContainer extends React.Component {

	constructor(props){
		super(props);
		this.toggleForms = this.toggleForms.bind(this);
		this.loginFunction = this.loginFunction.bind(this);
		this.updateUsername = this.updateUsername.bind(this);
		this.updatePassword = this.updatePassword.bind(this);
		this.updateEmail = this.updateEmail.bind(this);
		this.state = {
			login: true,
			register:false,
			processing:false,
			username: '',
			password: '',
			email: ''
		}
	}
	updateUsername (e) {
		this.setState({
			username: e.target.value
		})
	}
	updatePassword (e) {
		this.setState({
			password: e.target.value
		})
	}
	updateEmail (e) {
		this.setState({
			email: e.target.value
		})
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
	//this is here so that register can 
	loginFunction(obj){
		this.processing(true);
		let that = this;
		console.log(obj)
		return axios.post(`${API_BASE_URL}/api/auth/login`, obj)
		  .then(function(response){
		  	that.props.toggleLogin();
		  	that.processing(false);
		    that.setState({ username: '', password: ''})
		    that.props.addUserdata(response.data.user);
		    that.props.addToken(response.data.authToken);
		    if(response.data.user.avatars){
	            that.props.addItems(response.data.user.avatars);
	          }
		    
		  })
		  .catch((err) => {
		  	that.processing(false);
		  	that.setState({
		  		password: ''
			})
		  });  
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
						updateUsername={this.updateUsername}
						updatePassword={this.updatePassword}
						updateEmail={this.updateEmail}
						username={this.state.username}
						email={this.state.email}
						password={this.state.password}
						styleProp={loginClass} 
						loginFunction={this.loginFunction}
					/>
					<Register 
					loginFunction={this.loginFunction}
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

export const mapStateToProps = state => ({
    token: state.tokenReducer.token
});
function mapDispatchToProps(dispatch){
    return bindActionCreators({
        addToken, addUserdata, addItems}, dispatch);
}
export default connect(mapStateToProps, mapDispatchToProps)(LoginRegisterContainer);

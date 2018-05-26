import React from 'react';
import axios from 'axios';
import {API_BASE_URL} from '../../config';
import { addToken } from '../../actions/tokenActions.js';
import {connect} from 'react-redux';
class LoginForm extends React.Component {

	constructor(props){
		super(props);
		this.sendToServer = this.sendToServer.bind(this);
		this.updateUsername = this.updateUsername.bind(this);
		this.updatePassword = this.updatePassword.bind(this);
		this.state = {
			feedback: '',
			username: '',
			password: ''
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
	sendToServer (e){
		e.preventDefault();
		
		let that = this;
		let obj = {username: this.state.username, password: this.state.password}

		if (this.state.username === '' || this.state.password === '') {
			this.setState({
				feedback: 'please fill out all fields'
			})
			return
		}
		this.props.processing(true);

		return axios.post(`${API_BASE_URL}/api/auth/login`, obj)
		  .then(function(response){
		  	console.log(response.data);
		  	that.props.welcomeAnimation(response.data.user);
		  	that.props.processing(false);
		    that.setState({feedback: "done!"})
		    that.props.dispatch(addToken(response.data.authToken));
		    that.props.closeWindow();
		  })
		  .catch((err) => {
		  	console.error(err);
		  	that.props.processing(false);
		  	that.setState({
				feedback: err.response.data.message
			})
		  });  

	}
	render () {
		return (
		<form style={this.props.styleProp}   >
			<h4>Log In</h4>
			<input 
				type="text" 
				placeholder="username" 
				value={this.state.username} 
				onChange={ this.updateUsername } />
			<input 
			type="password" 
			placeholder="password"
			value={this.state.password} 
			onChange={ this.updatePassword } />
			<div>
				<button type="button" value="log in" onClick={(e) => this.sendToServer(e)}>log in</button>
			</div>
			<div className='formFeedback'>{this.state.feedback}</div>
		</form>

		)
	}
	
}

export const mapStateToProps = state => ({
    token: state.tokenReducer.token
});

export default connect(mapStateToProps)(LoginForm);
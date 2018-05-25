import React from 'react';
import axios from 'axios';
import './Register.css';
import {API_BASE_URL} from '../../config';

export default class Register extends React.Component {

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
	sendToServer (e) {
		e.preventDefault();
		
		let that = this;
		let obj = {username: this.state.username.trim(), password: this.state.password.trim()}

		if (this.state.username === '' || this.state.password === '') {
			this.setState({
				feedback: 'please fill out all fields'
			})
			return
		}
		
		this.props.processing(true);

		return axios.post(`${API_BASE_URL}/api/register`, obj)
		  .then(response => {
		  	console.log(response);
		  	this.props.processing(false);
		    that.setState({feedback: "done!"})
		  })
		  .catch(err => {
		  	this.props.processing(false);
		  	console.error(err)
		  	this.setState({
				feedback: err.response.data.message
			})
		  });  

	}
	render () {
		return (
			<form style={this.props.styleProp} onSubmit={this.sendToServer} >
				<h4>Register</h4>
				<input 
					type="text" 
					placeholder="username" 
					value={this.state.username} 
					onChange={ this.updateUsername } required />
				<input 
					type="password" 
					placeholder="password" 
					value={this.state.password} 
					onChange={(e) => this.updatePassword(e) } required />
				<div>
					<button type="button" onClick={this.sendToServer} >register</button>
				</div>
				<div className='formFeedback'>{this.state.feedback}</div>
			</form>

		)
	}
	
}
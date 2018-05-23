import React from 'react';
import axios from 'axios';
import {API_BASE_URL} from '../../config';

export default class Register extends React.Component {

	constructor(props){
		super(props);
		this.sendToServer = this.sendToServer.bind(this);
		this.updateUsername = this.updateUsername.bind(this);
		this.updatePassword = this.updatePassword.bind(this);
		this.state = {
			feedback: 'start',
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
		let obj = {username: this.state.username, password: this.state.password}

		if (this.state.username === '' || this.state.password === '') {
			this.setState({
				feedback: 'please fill out all fields'
			})
			return
		}


		return axios.post(`${API_BASE_URL}/api/register`, obj)
		  .then(function(response){
		  	console.log(response)
		    that.setState({feedback: "done!"})
		  })
		  .catch((err) => {
		  	console.error(err)
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
					<button type="button" onClick={this.sendToServer} >click</button>
				</div>
				<div>{this.state.feedback}</div>
			</form>

		)
	}
	
}
import React from 'react';
import axios from 'axios';
import {API_BASE_URL} from '../../config';

export default class LoginForm extends React.Component {

	constructor(props){
		super(props);
		this.sendToServer = this.sendToServer.bind(this);
		this.state = {
			feedback: 'start'
		}
	}
	sendToServer (e){
		e.preventDefault();
		let that = this;
		return axios.post(`${API_BASE_URL}auth/login`, {username: 'tyui', password: 'tyui'})
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
		<form style={this.props.styleProp} onClick={(e) => this.sendToServer(e)}  >
			<h4>Log In</h4>
			<input type="email" placeholder="email"  />
			<input type="password" placeholder="password"  />
			<div>
				<button type="button" value="log in">click</button>
			</div>
			<div>{this.state.feedback}</div>
		</form>

		)
	}
	
}
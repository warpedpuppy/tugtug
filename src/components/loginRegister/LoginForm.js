import React from 'react';


export default class LoginForm extends React.Component {

	constructor(props){
		super(props);
		this.sendToServer = this.sendToServer.bind(this);
		
		this.state = {
			feedback: ''
		}
	}
	
	sendToServer (e){
		e.preventDefault();
		let obj = {username: this.props.username, password: this.props.password}
		if (this.props.username === '' || this.props.password === '') {
			this.setState({
				feedback: 'please fill out all fields'
			})
			return
		}
		this.props.loginFunction(obj)
		this.setState({feedback: ''})
	}

	render () {
		return (
			<form style={this.props.styleProp}>
				<h4>Log In</h4>
				<input 
					type="text" 
					placeholder="username" 
					value={this.props.username} 
					onChange={ this.props.updateUsername } />
				<input 
					type="password" 
					placeholder="password"
					value={this.props.password} 
					onChange={ this.props.updatePassword } />
				<div>
					<button type="button" value="log in" onClick={(e) => this.sendToServer(e)}>log in</button>
				</div>
				<div className='formFeedback'>{this.state.feedback}</div>
			</form>
		)
	}
	
}

import React from 'react';
import './tempLogin.css';
import axios from 'axios';
import {API_BASE_URL} from '../../config';
import Utils from '../../animations/utils/utils';
export default class TempLoginForm extends React.Component {

	constructor(props){
		super(props);
		this.login = this.login.bind(this);
		
		this.state = {
			feedback: '',
			password: '',
			color1: '#FF0000',
			color2: '#FFFF00',
			color3: '#FF00FF',
			login: false
		}
	}
	toggleLogin (e) {
		this.setState({login: !this.state.login})
	}
	login (e) {
		e.preventDefault();
		let hex = Utils.randomHex();
		this.setState({
			color1: Utils.randomHex(),
			color2: Utils.randomHex(),
			color3: Utils.randomHex(),
			password: e.target.value
		})
		let obj = {
			password: e.target.value
		},
		that = this;

		return axios.post(`${API_BASE_URL}/api/auth/testLogin`, obj)
		  .then(function(response){
		  	if (response.data.valid === true) {
		  		that.setState({password: ''});
		  		that.props.loggedInFunction()
		  	}
		    
		  })
		  .catch((err) => {
		  	console.log(err)
		  });  

	}


	render () {
		let formClass = {
			borderRightColor: `${this.state.color1}`,
			borderLeftColor: `${this.state.color1}`,
			borderTopColor: `${this.state.color2}`,
			borderBottomColor: `${this.state.color2}`
		};
		let fieldsetClass = {
			borderRightColor: `${this.state.color2}`,
			borderLeftColor: `${this.state.color2}`,
			borderTopColor: `${this.state.color3}`,
			borderBottomColor: `${this.state.color3}`
		};
		let content = (this.state.login)?
			<fieldset style={fieldsetClass}>
			<legend>log in:</legend>
			<form className="tempLoginForm" style={formClass} onSubmit={ this.sendToServer }>
				<input 
					type="password" 
					placeholder="password"
					value={this.state.password} 
					onChange={ e => this.login(e) } required/>
				<div className='formFeedback'>{this.state.feedback}</div>
			</form>
			</fieldset>:
			<div>
				<p>TugTug is launching September 2019. 2</p>
			</div>
			;
		let clickValue = (this.state.login)?"hide log in":"log in";

		return (
			<div className="tempLogin">
				<div className="inner">
					<img src="/bmps/tugtug.png" />
						{content}
					<span 
					onClick={(e) => this.toggleLogin()}
					className="loginClick">{clickValue}</span>
				</div>
			</div>
		)
	}
	
}

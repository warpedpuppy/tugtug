import React from 'react';
import './Contact.css'
import axios from 'axios';
import {API_BASE_URL} from '../config';
export default class Contact extends React.Component {

	constructor(props){
		super(props);
		this.onSubmitHandler = this.onSubmitHandler.bind(this);
		this.state = {
			message: 'type here',
			results: ''
		}
	}

	onSubmitHandler (e) {
		e.preventDefault();
		let that = this;
		let obj = {
			message: this.state.message
		}
		axios
		.post(`${API_BASE_URL}/api/mail`, obj)
		.then(function(response){
			//console.log(response);
			that.setState({
				message: '',
				results: 'message sent'
			})
		})
		.catch((err) => {
			console.error(err);
		});  
	}

	onChangeHandler (e) {
		e.preventDefault(e);
		this.setState({
			message: e.target.value
		})
	}

	render() {
		 return (
		    <div className="contactPage">
		    <div className="inner">	
		      <h1>Contact</h1>
		      <form onSubmit={e => this.onSubmitHandler(e) }>
			      <textarea 
				      value={this.state.message} 
				      onChange={(e) => this.onChangeHandler(e)}>
			      </textarea>
			      <input type="text" className="tester" placeholder='do not type here' />
			      <button type='submit'>submit form</button>
			      <div className="results">{this.state.results}</div>
		      </form>	
		      </div>
		      </div>
		   );
	}
   
}

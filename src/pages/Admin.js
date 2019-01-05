import React from 'react';
import {connect} from 'react-redux';
import axios from 'axios';
import './Admin.css';
import {API_BASE_URL} from '../config';
import { toggleActive } from '../actions/avatarActions';
import AdminItemModule from '../components/admin/AdminItemModule';
import CheckForToken from '../components/utils/CheckForToken.js';

class Admin extends React.Component {

	constructor(props){
		super(props);
		this.onSubmit = this.onSubmit.bind(this);
		this.updateUsername = this.updateUsername.bind(this);
		this.updateFirstname = this.updateFirstname.bind(this);
		this.updateLastname = this.updateLastname.bind(this);
		this.updateEmail = this.updateEmail.bind(this);
		this.toggleActive = this.toggleActive.bind(this);
		this.changeTab = this.changeTab.bind(this);
		this.state = {
			username: this.props.username,
			firstName: this.props.firstName,
			lastName: this.props.lastName,
			email: this.props.email,
			activeTab: 'products'
		}
	}

	onSubmit (e) {

		e.preventDefault();

		let obj = {
			username: this.state.username || this.props.username,
			firstName: this.state.firstName || this.props.firstName,
			lastName: this.state.lastName || this.props.lastName,
			email: this.state.email || this.props.email,
		}
		return axios.put(`${API_BASE_URL}/api/users/update`, obj, {
			headers: { "Authorization": `Bearer ${this.props.token}`}
		})
		.then(function(response){
		  console.log('return value = ', response.data);
		})
		.catch((err) => {
		  console.error(err);
		});  
	
	}
	updateUsername (e) {
		this.setState({
			username: e.target.value
		})
	}
	updateFirstname (e) {
		this.setState({
			firstName: e.target.value
		})
	}
	updateLastname (e) {
		this.setState({
			lastName: e.target.value
		})
	}
	updateEmail (e) {
		this.setState({
			email: e.target.value
		})
	}
	toggleActive (index, name, active, url) {
		console.log('toggle active', index, name, active)
		let newActive = (active.toString() === 'true')?false:true;
		let obj = {
			name,
			active: newActive,
			url:url
		}
		console.log('BOOM')
		this.props.dispatch(toggleActive(name, newActive, url));


		axios.put(`${API_BASE_URL}/store/make_item_active`, obj, {
			headers: { "Authorization": `Bearer ${this.props.token}`}
		})
		.then(function(response){
		  console.log('toggle active response = ', response.data);
		})
		.catch((err) => {
		  console.error('toggle active response error= ', err);
		});  

	}
	
	changeTab(e){
		this.setState({activeTab: e.target.innerHTML})
	}
	

	render () {
		let username = this.state.username || this.props.username;
		let firstName = this.state.firstName || this.props.firstName;
		let lastName = this.state.lastName || this.props.lastName;
		let email = this.state.email || this.props.email;
		let itemsDivs = this.props.items.map((item, index) => {
			// console.log('item = ', item);
			// console.log('index = ', index)
			return <AdminItemModule 
				key={index} 
				index={index} 
				image={item.url} 
				name={item.name} 
				active={item.active.toString()} 
				toggleActive={this.toggleActive} 
			/>
		})
		let productsClass = (this.state.activeTab === 'products')?'productsDiv':'productsDiv hide';
		let accountsClass = (this.state.activeTab === 'account')?'accountForm':'accountForm hide';
		let productsTabClass = (this.state.activeTab === 'products')?'tab productsTab active':'tab productsTab';
		let accountsTabClass = (this.state.activeTab === 'account')?'tab accountTab active':'tab accountTab';
		return (
			<div className="adminPage">
			<CheckForToken />

			<div className="adminContainer">

			<div className="tabContainer">
			<div className={productsTabClass} onClick={this.changeTab} >products</div>
				<div className={accountsTabClass} onClick={this.changeTab} >account</div>
				
			</div>

			<div className="tabBody">
			<div className={accountsClass}>
				<form id='userAdmin'>
					<div className="formData">
						<label>username: </label>
						<input 
						type="text" 
						value={username} 
						onChange={ this.updateUsername }/>
					</div>

					<div className="formData">
						<label>first name: </label>
						<input 
						type="text" 
						value={firstName} 
						onChange={ this.updateFirstname }/>
					</div>

					<div className="formData">
						<label>last name: </label>
						<input 
						type="text" 
						placeholder={lastName} 
						onChange={ this.updateLastname }/>
					</div>

					<div className="formData">
						<label>email: </label>
						<input 
						type="email" 
						placeholder={email} 
						onChange={ this.updateEmail }/>
					</div>

					<button type="submit" onClick={this.onSubmit}>edit data</button>

				</form>
				</div>
				<div className={productsClass}>
					<div>{this.props.items.length} items</div>
					{itemsDivs}
				</div>
				</div>
			</div>
			</div>
			)
	}
}

export const mapStateToProps = state => ({
    token: state.tokenReducer.token,
    username: state.tokenReducer.username,
    firstName: state.tokenReducer.firstName,
    lastName: state.tokenReducer.lastName,
    email: state.tokenReducer.email,
    items: state.avatarReducer.items
});

export default connect(mapStateToProps)(Admin);

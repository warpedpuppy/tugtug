import React from 'react';
import ItemModule from '../components/store/itemModule.js';
import './Store.css';
import axios from 'axios';
import {API_BASE_URL} from '../config';
import CheckForToken from '../components/utils/CheckForToken.js';
import { connect } from 'react-redux';
import { addItems } from '../actions/avatarActions.js';

class Store extends React.Component {

	constructor (props) {
		super(props);
		this.onPurchase = this.onPurchase.bind(this);
		this.state = {
			products: []
		}
	}

	componentWillMount () {
		let that = this;
		axios
		.get(`${API_BASE_URL}/store`)
		.then(function(response){
			that.setState({
				products: response.data.products
			})
		})
		.catch((err) => {
			console.error(err);
		});  
	}
	onPurchase (price, name, url){
		//this.props.dispatch(addItem(name));
		let lsToken = localStorage.getItem('token');
		let obj = { name, url, username: this.props.username };
		console.log('obj = ', obj)
		let that = this;
		axios
		.post(`${API_BASE_URL}/store/avatar_item`, 
			obj,
			{ headers: {"Authorization" : `Bearer ${lsToken}`} })
		.then(function(response){
			console.log("on purchase = ", response);
			if(response.data.avatars){
	            //console.log('items array = ', response.data.user.avatars)
	            that.props.dispatch(addItems(response.data.avatars));
	          }
		})
		.catch((err) => {
			console.error(err);
		});  
	}

	render () {
		let products = this.state.products.map( (product, index) => {
			let test = this.props.items.find(item => {
				return item.name === product.name
			}
			)
			let owned =(test)?'true':'false';
			
			return <ItemModule key={index} name={product.name} image={product.imgURL} price={product.price} purchase={this.onPurchase} owned={owned} />
		})
		return (
			<div className="storeCont">
				<CheckForToken />
				<h1>store</h1>
				{products}
			</div>
		)

	}
	
}

export const mapStateToProps = state => ({
    items: state.avatarReducer.items,
    username: state.tokenReducer.username
});

export default connect(mapStateToProps)(Store);
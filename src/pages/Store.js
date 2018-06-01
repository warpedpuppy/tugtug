import React from 'react';
import ItemModule from '../components/store/itemModule.js';
import './Store.css';
import axios from 'axios';
import {API_BASE_URL} from '../config';

export default class Store extends React.Component {

	constructor (props) {
		super(props)
		this.state = {
			products: []
		}
	}

	componentWillMount () {
		let that = this;
		axios
		.get(`${API_BASE_URL}/store`)
		.then(function(response){
			// console.log(response.data);

			that.setState({
				products: response.data.products
			})
		})
		.catch((err) => {
		console.error(err);

		});  
	}
	onPurchase (price, name){
		alert(price, name)
	}

	render () {
		let products = this.state.products.map( (product, index) => <ItemModule key={index} name={product.name} image={product.imgURL} price={product.price} purchase={this.onPurchase} />)
		return (
			<div className="storeCont">
				<h1>store</h1>
				{products}
			</div>
		)

	}
	
}
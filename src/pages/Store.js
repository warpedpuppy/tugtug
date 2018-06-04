import React from 'react';
import ItemModule from '../components/store/itemModule.js';
import './Store.css';
import axios from 'axios';
import {API_BASE_URL} from '../config';
import { addItem } from '../actions/avatarActions.js'
import { connect } from 'react-redux';

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
	onPurchase (price, name){
		this.props.dispatch(addItem(name));
		let lsToken = localStorage.getItem('token')
		axios
		.post(`${API_BASE_URL}/store/avatar_item`, { name, username: this.props.username },{ headers: {"Authorization" : `Bearer ${lsToken}`} })
		.then(function(response){
			console.log(response)
		})
		.catch((err) => {
			console.error(err);
		});  
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

export const mapStateToProps = state => ({
    items: state.avatarReducer.items,
    username: state.tokenReducer.username
});

export default connect(mapStateToProps)(Store);
import React from 'react';
import ItemModule from '../components/store/itemModule.js';
import './Store.css';
import axios from 'axios';
import {API_BASE_URL} from '../config';
import CheckForToken from '../components/utils/CheckForToken.js';
import { connect } from 'react-redux';
import { addItems, addItem } from '../actions/avatarActions.js';

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
		if(this.props.username === "Testy") {
			let obj = {
				url: url,
				name: name,
				active: false
			}
			console.log(obj)
			this.props.dispatch(addItem(obj));
			return;
		}

		let lsToken = localStorage.getItem('token');
		let obj = { name, url, username: this.props.username };
		let that = this;
		console.log('here')
		axios
		.post(`${API_BASE_URL}/store/buy_accessory`, 
			obj,
			{ headers: {"Authorization" : `Bearer ${lsToken}`} })
		.then(function(response){
			console.log("on newRecord = ", response.data.newRecord);
			//console.log("on bitmaps = ", response.data.newRecord.bitmaps);
			//response.data.newRecord.bitmaps will be array of items
			if(response.data.newRecord){
	            //console.log('items array = ', response.data.newRecord.accessories)
	            that.props.dispatch(addItem(response.data.newRecord));
	          }
		})
		.catch((err) => {
			console.error(err);
		});  
	}

	render () {
		// console.log('products = ', this.state.products)
		// if(this.props.items[0]){
		// 	console.log('items = ', this.props.items)
		// }
		
		let products = this.state.products.map( (product, index) => {
			let test = this.props.items.find(item => {
				return item.url === product.imgURL
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
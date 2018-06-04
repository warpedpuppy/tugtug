import React from 'react';
import './itemModule.css';

export default function ItemModule (props) {
	let purchased = (props.owned === 'true')?'':
	<button onClick={() => props.purchase(props.price, props.name, props.image)}>buy product</button>
	return (
		<div className="itemModule">
		<h1>{props.name}</h1>
		<img src={props.image} alt={props.name}/>
		<div>price: {props.price}</div>
		<div>owned: {props.owned}</div>
		{purchased}
		</div>
		)
}
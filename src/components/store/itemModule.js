import React from 'react';
import './itemModule.css';

export default function ItemModule (props) {

	return (
		<div className="itemModule">
		<h1>{props.name}</h1>
		<img src={props.image} alt={props.name}/>
		<div>price: {props.price}</div>
		<button onClick={() => props.purchase(props.price, props.name)}>buy product</button>
		</div>
		)
}
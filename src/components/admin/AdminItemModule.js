import React from 'react';
import './AdminItemModule.css';

export default function ItemModule (props) {
	let buttonText = (props.active === 'true')?'make inactive':'make active';
	return (
		<div className="adminItemModule">
		<h1>{props.name}</h1>
		<img src={props.image} alt={props.name}/>
		<div>{props.active}</div>
		<button onClick={() => props.toggleActive(props.index, props.name, props.active)}>{buttonText}</button>
		</div>
		)
}
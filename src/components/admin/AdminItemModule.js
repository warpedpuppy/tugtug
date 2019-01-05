import React from 'react';
import './AdminItemModule.css';

export default function ItemModule (props) {
	let buttonText = (props.active === 'true')?'make inactive':'make active';
	let activeText = (props.active === 'true')?'This is currently being used.':'This is not being used currently.';
	return (
		<div className="adminItemModule">
		<h1>{props.name}</h1>
		<img src={props.image} alt={props.name}/>
		<div>{activeText}</div>
		<button onClick={() => props.toggleActive(props.index, props.name, props.active, props.image)}>{buttonText}</button>
		<button onClick={() => props.deleteItem(props.index, props.name)}>delete this item</button>
		</div>
		)
}
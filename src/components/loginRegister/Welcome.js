import React from 'react';
import './Welcome.css';

export default function Welcome(props) {

	if(props.showWelcome) {
		return (
			<div className='welcomeDiv'>
				<h1>welcome</h1>
			</div>
		)
	} else {
		return (
			<div className='welcomeDivTemp'>no anim yet</div>
		)
	}
}
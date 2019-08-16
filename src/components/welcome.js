import React from 'react';
import './welcome.css';


export default function Welcome (props) {
		let message = (!props.isMobileOnly)?<p>just, welcome.</p> : <p>sorry, this site if for ipads or computers.</p> ;	
		let classAddOn = (props.isMobileOnly)? "welcomeDivOuter mobileOnlyWelcome" : "welcomeDivOuter";
		return (
		<div className={classAddOn}>
		<div className="welcomeDiv">
			<p>welcome.</p>
			<img src="/bmps/welcomeArrow.png" />
		</div>
		</div>
		)
}


import React from 'react';
import './HeaderRing.css';

export default function HeaderRing(props) {

	let logoStyle = {
		top: `${props.topOffset}px`, 
		width: `${props.w}px`
	};
	let classes = `headerRing ${props.rotate}`
	return (
		<div className="svgDiv">
			<svg style={logoStyle} viewBox="0 0 199 199" className={classes}>
			<defs>
			<radialGradient id="radial-gradient" cx="20" cy="41.5" r="10.5" gradientUnits="userSpaceOnUse">
			<stop offset="0" stopColor="#fff"/>
			<stop offset="1" stopColor="#fcee21"/>
			</radialGradient>
			</defs>
			<title>Asset 8</title>
			<g id="Layer_2" data-name="Layer 2"><g id="Layer_1-2" data-name="Layer 1">
			<path className="cls-1" d="M99.5.5a99,99,0,1,0,99,99A99,99,0,0,0,99.5.5Zm0,193a94,94,0,1,1,94-94A94,94,0,0,1,99.5,193.5Z"/>
			<circle className="cls-2" cx="21.5" cy="43.5" r="10.5"/>
			</g>
			</g>
			</svg>
		</div>
		)
}
import React, { Component } from 'react';
import HeaderRing from '../svgs/HeaderRing'

export default class LogoGraphic extends Component {

	render (){
		return (
			<div className="logoGraphic">
				<HeaderRing w={50} topOffset={50} rotate={'clockwise'} />
				<HeaderRing w={100} topOffset={25} rotate={'counterClockwise'} />
				<HeaderRing w={150} topOffset={0} rotate={'clockwise'} />
			</div>
		)
	}
}
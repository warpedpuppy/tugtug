import React from 'react';
import HeaderRing from '../svgs/HeaderRing'
import './LogoGraphic.css';
export default function LogoGraphic (props) {

		return (
			<div className='logoGraphic'>
				<HeaderRing w={50} topOffset={50} rotate={'clockwise'} />
				<HeaderRing w={100} topOffset={25} rotate={'counterClockwise'} />
				<HeaderRing w={150} topOffset={0} rotate={'clockwise'} />
			</div>
		)

}
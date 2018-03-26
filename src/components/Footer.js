import React from 'react';
import twitter from '../svgs/Twitter.svg';
import './Footer.css'
export default function Footer (){
	return (
		<footer>
			<a href="https://twitter.com/warpedPuppy" rel="noopener noreferrer" target="_blank">
				<img src={twitter}  className="twitter" alt="twitter" />
			</a>
		</footer>
	)
}
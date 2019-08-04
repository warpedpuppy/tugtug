import React from 'react';
import './Footer.css';
import { Link } from 'react-router-dom';
export default function Footer (props) {
		let arr = [["/", "home"], ["/about", "about"], ["/contact", "contact"]]
		let printVal = arr.map((item, index) => {
			if (item[0] !== props.page) {
				return (
					<Link key={index} to={item[0]}>
						<span>{item[1]}</span>
					</Link>
				)
			} else {
				return <span key={index}></span>
			}
			
			
		})
		return (
			<footer>
				{ printVal }
			</footer>
		)
}


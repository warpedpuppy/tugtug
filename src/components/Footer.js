import React from 'react';
import './Footer.css';
import {connect} from 'react-redux';
import { Link } from 'react-router-dom';
function Footer (props) {
		let arr = ["home", "about", "contact"]
		let printVal = arr.map((item, index) => {
			let link = (item === "home")?"/":"/"+item;
			return (
			<Link key={index} to={link}>
				<span>{item}</span>
			</Link>
			)
		})
		return (
		<footer>
			{ printVal }
		</footer>
		)
}
export const mapStateToProps = state => ({
    token: state.tokenReducer.token
});

export default connect(mapStateToProps)(Footer);

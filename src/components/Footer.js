import React from 'react';
import './Footer.css';
import {connect} from 'react-redux';
import { Link } from 'react-router-dom';
function Footer (props) {
		return (
			<footer>
			<Link to="/about">
				<span>about</span>
			</Link>
			<span> | </span>
			<Link to="/contact">
				<span>contact</span>
			</Link>
			
		</footer>
		)
}
export const mapStateToProps = state => ({
    token: state.tokenReducer.token
});

export default connect(mapStateToProps)(Footer);

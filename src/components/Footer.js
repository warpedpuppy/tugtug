import React from 'react';
import { Link } from 'react-router-dom';
import twitter from '../svgs/Twitter.svg';
import './Footer.css';
import {connect} from 'react-redux';

function Footer (props) {

	if(props.token === 'blank') {
		return (
			<footer>
			<a href="https://twitter.com/tedwalther" rel="noopener noreferrer" target="_blank">
				<img src={twitter}  className="twitter" alt="twitter" />
			</a>
		</footer>
		)
	} else {
		return (
		<footer>
			<Link to="/admin">
				<span>admin</span>
			</Link>
			<a href="https://twitter.com/tedwalther" rel="noopener noreferrer" target="_blank">
				<img src={twitter}  className="twitter" alt="twitter" />
			</a>
		</footer>
	)
	}
	
}
export const mapStateToProps = state => ({
    token: state.tokenReducer.token
});

export default connect(mapStateToProps)(Footer);

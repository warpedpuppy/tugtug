import React from 'react';
import './Welcome.css';
import {connect} from 'react-redux';
class Welcome extends React.Component {


	
		render () {
		if (this.props.token !== 'blank') {

				return (
					<div className='welcomeDiv'>
						<h1>Welcome {this.props.username} !</h1>
					</div>
				)
		} else {
			return (
				<div className='welcomeDivTemp'>please log in!</div>
			)
		}
	}


}
export const mapStateToProps = state => ({
    token: state.tokenReducer.token,
    username: state.tokenReducer.username
});

export default connect(mapStateToProps)(Welcome);
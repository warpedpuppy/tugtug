import React from 'react';
import './Home.css';
import Welcome from '../components/loginRegister/Welcome';
import HomeCanvas from '../components/HomeCanvas';

import { connect } from 'react-redux';
import { changePage } from '../actions/themeActions.js';

class Home extends React.Component {

	// constructor (props) {
	// 	super(props)
	// }
	componentWillMount () {
		console.log('home mounting');
		this.props.dispatch(changePage());

	}

	render () {
		return (
		  <div className='homePage'>
		  	  <HomeCanvas />
			  <Welcome />
	      </div>
	    );    
	}
	
}

export const mapStateToProps = state => ({
    page: state.themeReducer.page
});
export default connect(mapStateToProps)(Home);
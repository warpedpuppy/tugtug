import React from 'react';
import './Home.css';
import {connect} from 'react-redux';
import Welcome from '../components/loginRegister/Welcome';

class Home extends React.Component {
	render () {
		return (
		  <div className='homePage'>
		  <Welcome />
	      </div>
	    );
	}
    
}

export const mapStateToProps = state => ({
    items: state.items
});

export default connect(mapStateToProps)(Home);
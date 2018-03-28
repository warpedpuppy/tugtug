import React from 'react';
import './Home.css';
import HomeCanvas from '../components/HomeCanvas';
import {connect} from 'react-redux';


class Home extends React.Component {
	render () {
		return (
		  <div className='homePage'>
		    <div id="fpsChecker"></div>
			<HomeCanvas />
	      </div>
	    );
	}
    
}

export const mapStateToProps = state => ({
    items: state.items
});

export default connect(mapStateToProps)(Home);
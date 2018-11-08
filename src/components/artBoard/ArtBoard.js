import React from 'react';
import './ArtBoard.css';

import {connect} from 'react-redux';
class ArtBoard extends React.Component {
	
	render () {
		return (
			<div className="art_board"></div>
		)
	}
	
}



export default connect()(ArtBoard);

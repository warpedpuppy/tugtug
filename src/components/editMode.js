import React from 'react';
import './editMode.css';
import {connect} from 'react-redux';
import { SketchPicker } from 'react-color';
import { toggleEditMode, changeColor } from '../actions/themeActions';

class EditMode extends React.Component {
	constructor(props){
		super(props);
		this.editModeHandler = this.editModeHandler.bind(this);
		this.state = {
		    background: '#fff',
		    panelVisible: false
		  };
	}
	editModeHandler (e) {
		e.preventDefault();
		this.props.dispatch(toggleEditMode(!this.props.editMode));
	}
	handleChangeComplete = (color) => {
		this.props.dispatch(changeColor(color.hex))
	}
	render () {
		let panelClass = (this.props.editMode)?"show":"hide";
		return (
			<div className="editModeShell">
    		<button 
    		className="button editModeButton" 
    		onClick={ e => this.editModeHandler(e) }>edit mode {this.props.editMode.toString()}</button>
    		<SketchPicker 
				className={panelClass}
        		color={ this.state.background }
        		onChangeComplete={ this.handleChangeComplete }
        		/>
    		</div>
		)
	}
	
}

export const mapStateToProps = state => ({
    editMode: state.themeReducer.editMode
});

export default connect(mapStateToProps)(EditMode);

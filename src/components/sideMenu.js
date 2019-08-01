import React from 'react';
import './sideMenu.css';

export default class SideMenu extends React.Component {

	constructor (props) {
		super(props)
	}
	render () {
		return (
			<div className="buttonDivCont">
				<div className="homeMenuButtonDiv" >
				<button className="homeMenuButton" onClick={ e => this.props.changeState(e)}>home</button>
					<button className="homeMenuButton" onClick={ e => this.props.changeState(e)}>fly</button>
					<button className="homeMenuButton" onClick={ e => this.props.changeState(e)}>swim</button>
					<button className="homeMenuButton" onClick={ e => this.props.changeState(e)}>jump</button>
					<button className="homeMenuButton" onClick={ e => this.props.changeState(e)}>all three</button>
				</div>
			</div>
			)
	}
}
import React from 'react';
import './sideMenu.css';

export default class SideMenu extends React.Component {

	constructor (props) {
		super(props)
		this.state = {
			open: true
		}
	}
	toggleMenu () {
		this.setState({open: !this.state.open})
		this.props.toggleAction();
	}
	buttonClickHandler (e) {
		this.toggleMenu();
		this.props.changeState(e)

		if (this.state.open) {
			//pause game
		}
	}
	render () {

		let className = (this.state.open)?"buttonDivCont":"buttonDivCont hideMenu";
		return (
			<div className={ className }>
				<button className="toggleSideMenu" onClick={ () => this.toggleMenu() }></button>
				<div className="homeMenuButtonDiv" >
					<button className="homeMenuButton" onClick={ e => this.buttonClickHandler(e)}>home</button>
					<button className="homeMenuButton" onClick={ e => this.buttonClickHandler(e)}>fly</button>
					<button className="homeMenuButton" onClick={ e => this.buttonClickHandler(e)}>swim</button>
					<button className="homeMenuButton" onClick={ e => this.buttonClickHandler(e)}>jump</button>
					<button className="homeMenuButton" onClick={ e => this.buttonClickHandler(e)}>all three</button>
				</div>
			</div>
			)
	}
}
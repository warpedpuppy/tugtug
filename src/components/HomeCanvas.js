import React from 'react';
import './HomeCanvas.css';
import home_page from '../animations/intro_animation';

export default class HomeCanvas extends React.Component {

	constructor(props){
		super(props);
		this.home_page = {};
		this.testFilter = this.testFilter.bind(this);
		this.state = {
			filterTest: "off",
			nightMode: "off"
		}
	}
	componentDidMount(){
		this.home_page = home_page();
		this.home_page.init();
	}
	componentWillUnmount(){
		this.home_page.stop();
	}
	testFilter () {
		this.home_page.filterTest();
		if(this.state.filterTest === "off") {
			this.setState({filterTest: "on"})
		} else { 
			this.setState({filterTest: "off"})
		}
	}
	nightMode () {
		this.home_page.nightMode();
		if(this.state.nightMode === "off") {
			this.setState({nightMode: "on"})
		} else { 
			this.setState({nightMode: "off"})
		}
	}
	switchPlayer () {
		this.home_page.switchPlayer();
	}
	render () {
		let backgroundCSS = (this.state.nightMode === "off")?'waterBackground':'nightBackground';
		return (
			<div>
			<div id='homeCanvas' className={backgroundCSS} ></div>
			
			<div className="testPanel">
			<button onClick={() => this.testFilter()}>filter test is {this.state.filterTest}</button>
			<button onClick={() => this.nightMode()}>night mode {this.state.nightMode}</button>
			<button onClick={() => this.switchPlayer()}>switch player</button>
			</div>
		
			</div>
		)
	}
}
import React from 'react';
import './Home.css';
import HomeButtons from '../animations/homeAnimations/home_buttons';
export default class Home extends React.Component {
    componentDidMount () {
        this.home_buttons = HomeButtons();
        this.home_buttons.init();
    }
    componentWillUnmount () {
        this.home_buttons.stop();
    }
    gotoGame = (game) => {
        this.props.history.push(game)
    }
    render () {
        return (
            <div className="general-page-layout">
                <div className="home-page-buttons">
                    <div 
                    onClick={() => this.gotoGame('fly-game')} 
                    className="gameShell fly" 
                    id="fly-home"></div>
                    <div 
                    onClick={() => this.gotoGame('jump-game')} 
                    className="gameShell jump" 
                    id="jump-home"></div>
                    <div 
                    onClick={() => this.gotoGame('swim-game')} 
                    className="gameShell swim" id="swim-home"></div>
                </div>
            </div>
        )
    }
}
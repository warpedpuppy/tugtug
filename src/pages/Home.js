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
        console.log("click")
        this.props.history.push(game);
    }
    render () {
        return (
            <div className="general-page-layout">

                <div className="home-page-buttons">

                    <div class="home-button-cont" onClick={() => this.gotoGame('fly-game')} >
                        <div className="gameShell fly" id="fly-home"></div>
                        <div className="screen"></div>
                    </div>

                    <div class="home-button-cont" onClick={() => this.gotoGame('jump-game')} >
                        <div className="gameShell jump" id="jump-home"></div>
                        <div className="screen"></div>
                    </div>

                    <div class="home-button-cont" onClick={() => this.gotoGame('swim-game')} >
                        <div className="gameShell swim" id="swim-home"></div>
                        <div className="screen"></div>
                    </div>
                    
                </div>
            </div>
        )
    }
}
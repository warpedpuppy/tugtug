import React from 'react';
import './Home.css';
import HomeButtons from '../animations/homeAnimations/home_buttons';

export default class Home extends React.Component {
    state = {counter: 0}
    componentDidMount () {
        this.home_buttons = HomeButtons(this.clearSpiral);
        this.home_buttons.init();
    }
    clearSpiral = () => {
        this.setState({counter:1})
        console.log(this.counter)
    }
    componentWillUnmount () {
        this.home_buttons.stop();
    }
    gotoGame = (game) => {
        this.props.history.push(game);
    }

    render () {
        let spirals = (this.state.counter === 0)?`screen spiral`:`screen spiral`;
        return (
            <div className="general-page-layout">

                <div className="home-page-buttons">

                    <div className="home-button-cont" onClick={() => this.gotoGame('fly-game')} >
                        <div className="gameShell fly" id="fly-home"></div>
                        <div className="screen"></div>
                    </div>

                    <div className="home-button-cont " onClick={() => this.gotoGame('jump-game')} >
                        <div className="gameShell jump" id="jump-home"></div>
                        <div className="screen"></div>
                    </div>

                    <div className="home-button-cont" onClick={() => this.gotoGame('swim-game')} >
                        <div className="gameShell swim" id="swim-home"></div>
                        <div className="screen"></div>
                    </div>
                    
                </div>
            </div>
        )
    }
}
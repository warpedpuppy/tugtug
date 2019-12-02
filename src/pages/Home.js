import React from 'react';
import './Home.css';
import FlyAnimation from '../animations/homeAnimations/fly';
import SwimAnimation from '../animations/homeAnimations/swim';
export default class Home extends React.Component {

    constructor(props){
        super(props)
     
    }
    componentDidMount () {
        this.fly = FlyAnimation();
        this.fly.init();

        this.swim = SwimAnimation();
        this.swim.init();
    }
    componentWillUnmount () {
        this.fly.stop();
        this.swim.stop();
    }

    render () {
        return (
            <div className="general-page-layout">
                <div className="home-page-buttons">
                    <div className="gameShell fly" id="fly-home"></div>
                    <div className="gameShell jump"></div>
                    <div className="gameShell swim" id="swim-home"></div>
                </div>
            </div>
        )
    }
}
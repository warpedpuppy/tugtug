import React from 'react';
import { Link } from 'react-router-dom';

export default class Home extends React.Component {

    render () {
        return (
            <React.Fragment>
                <h1>games</h1>
                <Link to='/jump-game'>jump game</Link>
                <Link to='/fly-game'>fly game</Link>
                <Link to='/swim-game'>swim game</Link>
            </React.Fragment>
        )
    }
}
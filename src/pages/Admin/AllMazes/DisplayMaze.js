import React from 'react';
import Grid from '../createGrid/Grid';
import Button from 'react-bootstrap/Button';
import './DisplayMaze.css';
import SiteContext from '../../../SiteContext';

export default class DisplayMaze extends React.Component {
    static contextType = SiteContext;

    chooseMaze = () => {
        this.context.setActiveMazeId(this.props.id)
    }

    render () {
        if (this.context.loggedIn){
            return (
                <div className="displayDiv" onClick={ this.chooseMaze }>
                    <Grid {...this.props} />
                    <Button 
                        onClick={ () => this.props.deleteMaze(this.props.id) } 
                        variant="outline-danger"
                    >Delete Maze</Button>
                </div>
            )
        } else {
            return (
                <div className="displayDiv" onClick={ this.chooseMaze }>
                    <Grid {...this.props} />
                </div>
            )
        }
    } 
}
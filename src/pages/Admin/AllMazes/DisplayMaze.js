import React from 'react';
import Grid from '../createGrid/Grid';
import Button from 'react-bootstrap/Button';
import './DisplayMaze.css';
import SiteContext from '../../../SiteContext';
import Alert from 'react-bootstrap/Alert';
export default class DisplayMaze extends React.Component {
    static contextType = SiteContext;

    chooseMaze = () => {
        this.context.setActiveMazeId(this.props.id)
    }

    render () {
        let active = (this.props.id === this.context.activeMazeId)?
        <Alert variant="success">active maze</Alert>
        : 
        <Alert variant="primary">click to make active</Alert>
        ;
        if (this.context.loggedIn){
            return (
                <div className="displayDiv" onClick={ this.chooseMaze }>
                    {active}
                    <Grid {...this.props} />
                    <Button 
                        onClick={ () => this.props.deleteMaze(this.props.id) } 
                        variant="outline-danger"
                        className="delete-maze-button"
                    >Delete Maze</Button>
                </div>
            )
        } else {
            return (
                <div className="displayDiv" onClick={ this.chooseMaze }>
                    <div>{active}</div>
                    <Grid {...this.props} />
                </div>
            )
        }
    } 
}
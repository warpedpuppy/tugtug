import React from 'react';
import Grid from '../createGrid/Grid';
import Button from 'react-bootstrap/Button';
import './DisplayMaze.css';
export default class DisplayMaze extends React.Component {

    render () {
        return (
            <div className="displayDiv">
                <Grid {...this.props} />
                <Button 
                    onClick={ () => this.props.deleteMaze(this.props.id) } 
                    variant="outline-danger"
                >Delete Maze</Button>
            </div>
        )
    } 
}
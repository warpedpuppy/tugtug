import React from 'react';
import MazeService from '../../../services/maze-service';
import DisplayMaze from './DisplayMaze';
import './AllGrids.css';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import SiteContext from '../../../SiteContext';

export default class AllGrids extends React.Component {

    constructor (props) {
        super (props);
        this.state = {
            mazes: [],
            show: false,
            idToDelete: undefined
        }
        this.loadMazes();
        
    }
    static contextType = SiteContext;
    handleClose = () => this.setState({show: false});

    handleShow = (id) => {
        this.setState({show: true, idToDelete: id});
    };

    deleteMazeHandler = () => {
        this.context.deleteMazes(this.state.idToDelete);
        
        MazeService.deleteMaze(this.state.idToDelete)
        .then( data => {
            console.log(data)
        })
        this.setState({show: false, idToDelete: undefined});
    }

    loadMazes = () => {
        MazeService.loadAllMazes()
        .then( data => {
            //this.setState({mazes: data.mazes})
            this.context.addMazes(data.mazes)
        })
    }

    render () {
        return (
            <React.Fragment>
            <div className="all-grids"> 
            {  
            this.context.mazes.map( (mazeObject, index) => {
                return <DisplayMaze 
                    key={ index }
                    deleteMaze={ this.handleShow }
                    {...mazeObject} />
            }) 
            }
            </div>
            <Modal show={this.state.show} onHide={this.handleClose}>
                <Modal.Header closeButton>
                <Modal.Title>Maze Deleterizer</Modal.Title>
                </Modal.Header>
                <Modal.Body>You are sure you want to delete?</Modal.Body>
                <Modal.Footer>
                <Button variant="danger" onClick={this.deleteMazeHandler}>
                    confirm delete
                </Button>
                <Button variant="warning" onClick={this.handleClose}>
                    cancel delete
                </Button>
                </Modal.Footer>
            </Modal>
            </React.Fragment>
        )
    }
}
import React from 'react';
import './NewGrid.css';
import Select from './Select';
import MazeService from '../../../services/maze-service';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import Grid from './Grid';
import SiteContext from '../../../SiteContext';

export default class NewGrid extends React.Component {
    state = {
        r: 20,
        c: 20,
        activeItem: 'hero',
        drawing: false,
        feedback: ''
        
    }
    static contextType = SiteContext;
    changeSize = (dimension, number) => {
        if (dimension === 'rows') {
            this.setState({r: number})
        } else {
            this.setState({c: number})
        }  
    }
    addItem = (x, activeItem) => {
        this.setState({activeItem})
    }
    onMouseDownHandler = (e) => {
        this.setState({drawing: true,feedback:''})
    }
    onMouseUpHandler = (e) => {
        e.stopPropagation();
        this.setState({drawing: false})
    }
    clearMaze = () => {
        var elems = document.querySelectorAll(".newGrid .cell");
        elems.forEach( node => {
            node.classList.remove("hero");
            node.classList.remove("wall");
            node.classList.remove("token1");
            node.classList.remove("token2");
            node.classList.remove("token3");
            node.classList.remove("token4");
        });
    }
    saveMazeHandler = e => {
        this.setState({feedback:''})
        let cells = document.querySelectorAll(".newGrid .cell"),
            obj = {},
            walls = [];

        cells.forEach( node => {
            let row = node.getAttribute('rowval'),
                cell = node.getAttribute('cellval'),
                className = node.getAttribute('class');
            if ( className.includes('hero') || 
                className.includes('token1') || 
                className.includes('token2') || 
                className.includes('token3') || 
                className.includes('token4')
            ) {
                obj[className.substr(5).trim()] = [ parseInt(row, 10), parseInt(cell, 10) ];
            } else if (className.includes('wall')) {
                walls.push([ parseInt(row, 10),  parseInt(cell, 10) ]);
            }
        })
        obj.walls = walls;
        obj.c = this.state.c;
        obj.r = this.state.r;
        if (obj['hero'] && obj['token1'] && obj['token2'] && obj['token3'] && obj['token4']){
            MazeService.saveMaze(obj)
            .then( res => {
                console.log(res)
                if(res.success) {
                    this.context.addMazes(obj);
                    this.clearMaze();
                    this.setState({feedback:<Alert variant="success">maze entered!</Alert>})
                }
            })
        } else {
            this.setState({feedback:<Alert variant="warning">you need to add everything</Alert>})
        }
        
    }
    render () {
        return (
            <div>
                <fieldset><legend>control panel</legend>
                <Select 
                    title={ "rows" } 
                    changeSize={ this.changeSize } 
                    currentValue={ this.state.rows }
                    array={Array.from(Array(51).keys()).splice(20)} />
                <Select 
                    title={ "cols" } 
                    changeSize={ this.changeSize }
                    currentValue={ this.state.cols }
                    array={Array.from(Array(51).keys()).splice(20)} />
                <Select 
                    title={ "place" } 
                    changeSize={ this.addItem }
                    currentValue={ this.state.activeItem  }
                    array={['wall', 'hero', 'token1', 'token2', 'token3', 'token4', 'erase']} />
                <Button variant="success"  onClick={ this.saveMazeHandler }>save maze</Button>
                </fieldset>
                { this.state.feedback} 
                <hr />
                <div onMouseDown={ this.onMouseDownHandler } onMouseUp={this.onMouseUpHandler} className="grid newGrid">
                    <Grid {...this.state} />
                </div>
            </div>
            
           
        )
    }
  
}
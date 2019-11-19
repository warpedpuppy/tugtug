import React from 'react';
import './Cell.css';
export default class Cell extends React.Component {
    state = {
        activeColor: ''
    }

    removeCurrent(str){
        let elem = document.querySelector(`.${str}`)
        if(elem)elem.classList.remove(str)
    }
    onMouseDownHandler = (e) => {
      
        if ( this.props.activeItem === 'wall' ) {
            this.setState({activeColor: 'wall'})
        } else if ( this.props.activeItem === 'hero' ) {
            this.removeCurrent('hero')
            this.setState({activeColor: 'hero'})
        } else if ( this.props.activeItem === 'token1') {
            this.removeCurrent('token1')
            this.setState({activeColor: 'token1'})
        } else if ( this.props.activeItem === 'token2') {
            this.removeCurrent('token2')
            this.setState({activeColor: 'token2'})
        } else if ( this.props.activeItem === 'token3') {
            this.removeCurrent('token3')
            this.setState({activeColor: 'token3'})
        } else if ( this.props.activeItem === 'token4') {
            this.removeCurrent('token4')
            this.setState({activeColor: 'token4'})
        } else if ( this.props.activeItem === 'erase') {
            this.setState({activeColor: ''})
        }
    }
  
    onMouseOverHandler = (e) => {
        e.stopPropagation();
        if (!this.props.drawing) return;
        if (this.props.activeItem === 'wall') {
            this.setState({activeColor: 'wall'})
        } else if (this.props.activeItem === 'erase') {
            this.setState({activeColor: ''})
        }
        
    }
    render () {

        let { hero, token1, token2, token3, token4 } = this.props;
        let heroClass = (hero && (hero[0] === this.props.rowval && hero[1] === this.props.cellval))?'hero':'';
        let token1Class = (token1 && (token1[0] === this.props.rowval && token1[1] === this.props.cellval))?'token1':'';
        let token2Class = (token2 && (token2[0] === this.props.rowval && token2[1] === this.props.cellval))?'token2':'';
        let token3Class = (token3 && (token3[0] === this.props.rowval && token3[1] === this.props.cellval))?'token3':'';
        let token4Class = (token4 && (token4[0] === this.props.rowval && token4[1] === this.props.cellval))?'token4':'';
        let wallClass = (this.props.wallBoolean)?'wall':'';
        return (
            <div 
                rowval={this.props.rowval}
                cellval={this.props.cellval}
                className={ `cell ${this.state.activeColor}${heroClass}${token1Class}${token2Class}${token3Class}${token4Class}${wallClass}` } 
                onMouseOver={ this.onMouseOverHandler }
                onMouseDown={ this.onMouseDownHandler }></div>
        )
    } 
}
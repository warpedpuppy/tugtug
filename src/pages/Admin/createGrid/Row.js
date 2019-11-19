import React from 'react';
import Cell from './Cell';
import './Row.css';
export default function Row (props) {
    let wallString = JSON.stringify(props.walls);
    let row = [];
    for  (let i = 0; i < props.c ;i ++) {
        let temp = JSON.stringify([props.rowval, i])
        let wallBoolean = (wallString)?wallString.includes(temp):false;
        row.push(<Cell 
                    cellval={i} 
                    key={i} 
                    wallBoolean={ wallBoolean }
                    // rowval={props.rowval} 
                    // activeItem={props.activeItem} 
                    // drawing={props.drawing} 
                    {...props}
                    />)
    }
    return (
        <div className="row">
            { row }
        </div>
    )
  
}
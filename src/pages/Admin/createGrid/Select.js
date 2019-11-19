import React from 'react';

export default function Select (props) {
    let dropDowns = [];
    for(let i = 0; i < props.array.length; i ++){
        dropDowns.push(<option key={i} val={props.array[i]}>{props.array[i]}</option>);
    }
    let select = (e) => {
        props.changeSize(props.title, e.target.value)
    }
    return (
        <span>
            <label>{props.title}: </label>
            <select id={props.title} onChange={ e => select(e) } value={props.currentValue}>
                {  dropDowns  }
            </select>
        </span>
       
    )
}
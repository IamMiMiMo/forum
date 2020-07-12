import React from 'react'

import * as classes from './Select.module.css';

const select = (props) => {

    let renderedOptions = [];

    for (const key in props.options) {
        renderedOptions.push(
            <option
                value={props.options[key].value}
                key={key}>

                {props.options[key].label}
            </option>
        );
    }

    return (
        <span className={classes.Select}>
            <select
                value={props.selectValue}
                onChange={props.selectOnChange}>

                {renderedOptions}
            </select>
        </span>
    )
}

export default select;

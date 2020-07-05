import React from 'react';
import classes from './Input.module.css';

const input = (props) => {

    return (
        <input
            className={classes.Input}
            value={props.value}
            placeholder={props.placeholder}
            onChange={props.onChange}
            type={props.type} />
    )
}

export default input;

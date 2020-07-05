import React from 'react';
import classes from './Button.module.css';

const Button = (props) => {

    const classList = [classes.Button];
    switch (props.type) {
        case "Success":
            classList.push(classes.Success);
            break;
        case "Warning":
            classList.push(classes.Warning);
            break;
        default:
            break;
    }

    return (
        <div className={classList.join(' ')} onClick={props.onClick}>
            {props.children}
        </div>
    )
}

export default Button;

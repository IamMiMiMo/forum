import React from 'react'
import classes from './Alert.module.css'

const alert = (props) => {

    const classList = [classes.Alert];
    switch(props.type){
        case "Success":
            classList.push(classes.Success);
            break;
        case "Danger":
            classList.push(classes.Danger);
            break;
        default:
            break;
    }

    return (
        <div className={classList.join(' ')}>
            <p>{props.children}</p>
        </div>
    )
}

export default alert;

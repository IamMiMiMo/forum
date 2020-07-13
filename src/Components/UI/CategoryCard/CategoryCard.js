import React from 'react';
import * as classes from './CategoryCard.module.css';

const categoryCard = (props) => {
    return (
        <div className={classes.CategoryCard} onClick={props.clicked}>
            <img src={props.icon} alt={props.name}/><p>{props.name}({props.count})</p>
        </div>
    )
}

export default categoryCard;

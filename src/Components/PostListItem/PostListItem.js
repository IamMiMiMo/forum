import React from 'react';
import classes from './PostListItem.module.css';

import {Link} from 'react-router-dom';

const postListItem = (props) => {

    return (
        <div className={classes.PostListItem}>
            <div style={{display: 'flex', justifyContent: 'space-between'}}>
                <div className={classes.PostDetail}>{props.author} </div>
                <div className={classes.PostCategory} onClick={props.categoryOnClick}>{props.category}</div>
            </div>
            <Link 
                to={{
                    pathname: "/post/" + props.id,
                    state: {
                        title: [props.title],
                    }
                }}
                ><p className={classes.PostTitle}>{props.title}</p></Link>
        </div>
    )
}

export default postListItem;

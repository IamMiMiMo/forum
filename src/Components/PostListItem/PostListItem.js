import React from 'react';
import classes from './PostListItem.module.css';

import {Link} from 'react-router-dom';

const postListItem = (props) => {
    return (
        <div className={classes.PostListItem}>
            <p className={classes.PostDetail}>{props.author}</p>
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

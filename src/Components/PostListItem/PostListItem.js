import React from 'react';
import classes from './PostListItem.module.css';

import {useHistory} from 'react-router-dom';
import * as PATH from '../../constants/paths';

const PostListItem = (props) => {

    const history = useHistory();

    const gotoPost = () => {
        history.push({
            pathname: PATH.POST_PATH + props.id,
            state: {title: [props.title]}
        })
    }

    return (
        <div className={classes.PostListItem} onClick={() => gotoPost()}>
            <div style={{display: 'flex', justifyContent: 'space-between'}}>
                <div className={classes.PostDetail}>{props.author} </div>
                <div className={classes.PostCategory} onClick={props.categoryOnClick}>{props.category}</div>
            </div>
            <p className={classes.PostTitle}>{props.title}</p>
        </div>
    )
}

export default PostListItem;

import React from 'react';
import ReactMarkdown from 'react-markdown';

import CommentBox from '../CommentBox/CommentBox';
import classes from './Comments.module.css';

const Comments = (props) => {

    return (
        <div className={classes.Comments}>
        {props.comments.map((item,index) => {
            return (
                <CommentBox index={index+1} author={item.author} key={item.key} time={item.timeStamp} onQuote={() => props.onQuote(item.content)}>
                    <ReactMarkdown source={item.content}></ReactMarkdown>
                </CommentBox>
            )
        })}
        </div>
    )
}

export default Comments;
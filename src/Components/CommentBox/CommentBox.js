import React from 'react';

import classes from './CommentBox.module.css';
import { faQuoteLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import moment from 'moment';

const Comment = (props) => {
    return (
        <div className={classes.CommentBox}>
            <div className={classes.CommentDetailsBar}>
                <p title={moment.utc(props.time).local().format('YYYY-MM-DD HH:mm:ss')}>#{props.index} - {props.author} | {moment(moment.utc(props.time), "YYYY-MM-DDThh:mm:ss").fromNow()}</p>
                <p className={classes.QuoteButton} onClick={props.onQuote}><FontAwesomeIcon icon={faQuoteLeft} /> 引用</p>
            </div>
            <div className={classes.CommentContent}>
                {props.children}
            </div>
        </div>
    )
}

export default Comment;
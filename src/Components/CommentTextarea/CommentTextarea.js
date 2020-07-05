import React from 'react';

import classes from './CommentTextarea.module.css';
import Button from '../UI/Button/Button';
import ReactMarkdown from 'react-markdown';

const CommentTextarea = (props) => {

    const classList = [classes.PostCommentBox]
    if (!props.valid) {
        classList.push(classes.Invalid)
    }

    return (
        <React.Fragment>
            <form onKeyPress={props.keyPress}>
                <div style={{ "position": "relative", "marginBottom": "15px" }}>
                    {!props.preview ?
                        <React.Fragment>
                            <textarea
                                className={classList}
                                value={props.text}
                                onChange={props.changeHandler}
                                placeholder="輸入你的想法..." />
                            <p className={classes.Remark}>(可使用<a href="https://markdown.tw/" target="_blank" rel="noopener noreferrer">Markdown</a>語法)</p>
                        </React.Fragment>
                        :
                        <div className={classes.PreviewBox}>
                            <ReactMarkdown source={props.text} />
                        </div>
                    }
                </div>
                <Button type={"Warning"} onClick={props.previewHandler}>{props.preview ? '編輯' : '預覽'}</Button>
                <Button type={"Success"} onClick={props.submitHandler}>發表</Button>
            </form>
        </React.Fragment>
    )
}

export default CommentTextarea;

import React from 'react';

import ReactMarkdown from 'react-markdown';
import { Editor } from 'react-draft-wysiwyg';

import classes from './CommentTextarea.module.css';
import Button from '../UI/Button/Button';

const CommentTextarea = (props) => {

    const classList = [classes.PostCommentBox]
    if (!props.valid) {
        classList.push(classes.Invalid)
    }

    return (
        <React.Fragment>
            {props.simple ?
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
                :
                <React.Fragment>
                    <Editor
                        wrapperClassName={classes.Wrapper}
                        editorClassName={classes.Editor}
                        editorRef={props.setEditorReference}
                        onEditorStateChange={props.onEditorStateChange}
                        toolbar={{
                            options: ['inline', 'blockType', 'fontSize', 'fontFamily', 'list', 'link', 'emoji', 'image', 'history'],
                            inline: {
                                inDropdown: false,
                                className: undefined,
                                component: undefined,
                                dropdownClassName: undefined,
                                options: ['bold', 'italic', 'strikethrough', 'monospace'],
                            }
                        }}
                    />
                    <Button type={"Success"} onClick={props.submitHandler}>發表</Button>
                </React.Fragment>
            }
        </React.Fragment>
    )
}

export default CommentTextarea;

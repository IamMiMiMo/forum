import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useRouteMatch, useHistory, Link } from 'react-router-dom';
import * as firebase from 'firebase/app';
import 'firebase/firebase-database';
import 'firebase/auth';
import moment from 'moment';
import { convertToRaw, EditorState, ContentState, convertFromRaw } from 'draft-js';
import { mdToDraftjs, draftjsToMd } from 'draftjs-md-converter';

import '../../../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import Comments from '../../../Components/Comments/Comments';
import classes from './Post.module.css';
import TitleBar from '../../../Components/UI/Nav/TitleBar/TitleBar';
import Alert from '../../../Components/UI/Alert/Alert';
import Spinner from '../../../Components/UI/Spinner/Spinner';
import CommentTextarea from '../../../Components/CommentTextarea/CommentTextarea';
import { faArrowLeft, faSignInAlt, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { FIREBASE_CONFIG } from '../../../constants/firebase';
import * as PATH from '../../../constants/paths';
import * as CONFIG from '../../../constants/config/config';
import 'moment/locale/zh-hk';
moment.locale('zh-hk');

const Post = (props) => {
    const [data, setData] = useState({});
    const [currentText, setCurrentText] = useState('');
    const [validInput, setValidInput] = useState(true);
    const [showAlert, setShowAlert] = useState({ show: false, type: '', content: '' });
    const [title, setTitle] = useState('');
    const [isPreview, setIsPreview] = useState(false);
    const [editorState, setEditorState] = useState(EditorState.createEmpty());

    const idRef = useRef();
    const match = useRouteMatch();
    const location = useLocation();

    useEffect(() => {
        if (match !== undefined) {
            idRef.current = match.params.id
        } else {
            idRef.current = location.pathname.replace(PATH.POST_LIST_PATH + '/', '')
        }
    }, [match, location.pathname])

    if (!firebase.apps.length) {
        firebase.initializeApp(FIREBASE_CONFIG);
    }

    const auth = firebase.auth();
    const [isAuth, setIsAuth] = useState(auth.currentUser !== null);

    //check auth state change
    useEffect(() => {
        var unsubscribe = auth.onAuthStateChanged((user) => {
            if (user) {
                setIsAuth(true);
                if (!user.emailVerified) {
                    showAlertHandler({ type: 'Danger', content: '留言前請先驗証電郵' })
                }
            } else {
                setIsAuth(false)
            }
        });

        return () => unsubscribe();
    }, [auth]);

    const signOut = () => {
        auth.signOut().then(() => {
            setIsAuth(false);
        }).catch((error) => {
            console.log(error)
        });
    }

    var database = firebase.database();

    //get post title
    useEffect(() => {
        database.ref(`posts/postList/${idRef.current}/title`).once('value').then((snapshot) => {
            if (snapshot.exists()) {
                setTitle(snapshot.val());
            } else {
                showAlertHandler({ type: 'Danger', content: '發生錯誤：無法讀取數據' });
            }
        });
    }, [database])

    //get post comments
    useEffect(() => {
        database.ref(`posts/postComments/${idRef.current}`).on('value', (snapshot) => {
            if (snapshot.exists()) {
                setData(snapshot.val());
            } else {
                showAlertHandler({ type: 'Danger', content: '發生錯誤：無法讀取數據' });
            }
        });
    }, [database])

    //put comment objects into an array for mapping
    const commentArray = [];
    for (const key in data) {
        commentArray.push({
            ...data[key],
            key: key
        })
    }

    //handle submit comment
    const submitComment = () => {
        if (currentText.trim().length !== 0) {
            const commentData = {
                author: auth.currentUser.displayName,
                content: currentText,
                timeStamp: moment.utc().format()
            }
            database.ref(`posts/postComments/${idRef.current}`)
                .push(commentData
                    , (error => {
                        if (error) {
                            console.log(error)
                            showAlertHandler({ type: 'Danger', code: error.code });
                        } else {
                            showAlertHandler({ type: 'Success', content: '已發表' });
                            setCurrentText('');
                            //prevent submit in preview mode

                            if (CONFIG.USE_SIMPLE_EDITOR) {
                                if (document.querySelector("textarea")) {
                                    document.querySelector("textarea").focus();
                                }
                                setIsPreview(false);
                            } else {
                                clearContent();
                                if (editorReferece) {
                                    editorReferece.focus();
                                }
                                // focus on rich text editor
                            }

                        }
                    }));
        }
    }

    //listen to ctrl + enter to submit comment (only valid for simple editor)
    const onKeyPress = () => {
        var keyPressed = window.event.keyCode;
        var ctrlPressed = window.event.ctrlKey;
        if (ctrlPressed && keyPressed === 13) {
            submitComment();
        }
    }

    //listen to text change in comment textarea (only valid for simple editor)
    const currentTextChangeHandler = (event) => {
        setCurrentText(event.target.value);
        if (event.target.value !== '' && event.target.value !== null) {
            setValidInput(true);
        }

    }

    const showAlertHandler = (options) => {
        const props = { type: '', content: '', code: '' };
        options = { ...props, ...options };
        setTimeout(() => { setShowAlert({ show: false, type: '', content: '', code: '' }) }, 3000);
        setShowAlert({ show: true, type: options.type, content: options.content, code: options.code })
    }

    // set preview (only valid for simple editor)
    const onPreviewHandler = () => {
        setIsPreview(!isPreview);
    }

    // quote
    const onQuoteHandler = (text) => {
        const formattedText = text.replace(/^/gm, '>')
        if (CONFIG.USE_SIMPLE_EDITOR) {
            setCurrentText(currentText + formattedText + '\n\n');
            if (document.querySelector("textarea")) {
                document.querySelector("textarea").focus();
            }
        } else {
            const rawData = mdToDraftjs(formattedText + '\n\n');
            const contentState = convertFromRaw(rawData);
            const newEditorState = EditorState.createWithContent(contentState);
            setEditorState(EditorState.moveFocusToEnd(newEditorState));
        }

    }

    // wysiwyg editor functions
    let editorReferece = null;
    const setEditorReference = (ref) => {
        editorReferece = ref;
        if (ref) {
            ref.focus();
        }
    }

    const onEditorStateChange = (es) => {
        setEditorState(es);
        setCurrentText(draftjsToMd(convertToRaw(es.getCurrentContent())));
    }

    const clearContent = () => {
        setEditorState(EditorState.push(editorState, ContentState.createFromText('')));
    }

    // history - url redirection
    const history = useHistory()
    const goBackHandler = () => {
        history.goBack();
    }

    // render comment textarea
    const commentRendered = () => {
        let content = [<Spinner key="spinner" />];
        if (commentArray.length > 0) {
            content = [<Comments comments={commentArray} key="comments" onQuote={onQuoteHandler} />]
            if (isAuth) {
                if (CONFIG.USE_SIMPLE_EDITOR) {
                    content.push(<CommentTextarea
                        valid={validInput}
                        text={currentText}
                        preview={isPreview}
                        changeHandler={(event) => currentTextChangeHandler(event)}
                        submitHandler={submitComment}
                        previewHandler={onPreviewHandler}
                        keyPress={(event) => onKeyPress(event)}
                        key="textarea" />);
                } else {
                    content.push(<CommentTextarea
                        submitHandler={submitComment}
                        setEditorReference={setEditorReference}
                        editorState={editorState}
                        onEditorStateChange={onEditorStateChange}
                        key="textarea"
                    />);
                }
            } else {
                content.push(<Link to={PATH.AUTH_PATH} key="loginPrompt"><p style={{ "textAlign": "center", "textDecoration": "underline" }}>登入帳號來參與討論</p></Link>)

            }
        }
        return content;
    }

    // configurate titleBar icons
    const rightIconRendered = () => {
        const content = [];
        if (isAuth) {
            content.push({ icon: faSignOutAlt, onClick: () => { signOut() } });
        } else {
            content.push({ icon: faSignInAlt, onClick: () => { history.push(PATH.AUTH_PATH) } });
        }
        return content;
    }


    return (
        <div>
            {showAlert.show && <Alert type={showAlert.type} code={showAlert.code}>{showAlert.content}</Alert>}
            <TitleBar left={[{ icon: faArrowLeft, onClick: goBackHandler }]} right={rightIconRendered()}>
                {title}
            </TitleBar>
            <div className={classes.PostBody}>
                {commentRendered()}
            </div>
        </div>

    )

}

export default Post;
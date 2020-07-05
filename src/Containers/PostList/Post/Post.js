import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useRouteMatch, useHistory, Link } from 'react-router-dom';
import * as firebase from 'firebase/app';
import 'firebase/firebase-database';
import 'firebase/auth';
import moment from 'moment';

import Comments from '../../../Components/Comments/Comments';
import classes from './Post.module.css';
import TitleBar from '../../../Components/UI/TitleBar/TitleBar';
import Alert from '../../../Components/UI/Alert/Alert';
import Spinner from '../../../Components/UI/Spinner/Spinner';
import CommentTextarea from '../../../Components/CommentTextarea/CommentTextarea';
import { faArrowLeft, faSignInAlt, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { FIREBASE_CONFIG } from '../../../constants/firebase';
import * as PATH from '../../../constants/paths';

const Post = (props) => {
    const [data, setData] = useState({});

    const [currentText, setCurrentText] = useState('');

    const [validInput, setValidInput] = useState(true);

    const [showAlert, setShowAlert] = useState({ show: false, type: '', content: '' });

    const [title, setTitle] = useState('');

    const [isPreview, setIsPreview] = useState(false);

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
                setIsAuth(true)
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
    useEffect(() => {
        database.ref(`posts/postList/${idRef.current}/title`).once('value').then((snapshot) => {
            if (snapshot.exists()) {
                setTitle(snapshot.val());
            } else {
                setShowAlert({ show: true, type: 'Danger', content: '發生錯誤：無法讀取數據' });
            }
        });
    }, [database])

    useEffect(() => {
        database.ref(`posts/postComments/${idRef.current}`).on('value', (snapshot) => {
            if (snapshot.exists()) {
                setData(snapshot.val());
            } else {
                setShowAlert({ show: true, type: 'Danger', content: '發生錯誤：無法讀取數據' });
            }
        });
    }, [database])

    const commentArray = [];
    for (const key in data) {
        commentArray.push({
            ...data[key],
            key: key
        })
    }

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
                            setShowAlert({ show: true, type: 'Danger', content: '發生錯誤：' + error });
                        } else {
                            setShowAlert({ show: true, type: 'Success', content: '已發表' });
                            setCurrentText('');
                            //prevent submit in preview mode
                            if (document.querySelector("textarea")) {
                                document.querySelector("textarea").focus();
                            }
                            setIsPreview(false);
                        }
                    }));
        }
    }

    const onKeyPress = () => {
        var keyPressed = window.event.keyCode;
        var ctrlPressed = window.event.ctrlKey;
        if (ctrlPressed && keyPressed === 13) {
            submitComment();
        }
    }
    const currentTextChangeHandler = (event) => {
        setCurrentText(event.target.value);
        if (event.target.value !== '' && event.target.value !== null) {
            setValidInput(true);
        }

    }

    const showAlertHandler = (options) => {
        setTimeout(() => { setShowAlert({ show: false, type: '', content: '' }) }, 3000);
        return (
            <Alert type={options.type}>{options.content}</Alert>
        )
    }

    const onPreviewHandler = () => {
        setIsPreview(!isPreview);
    }

    const onQuoteHandler = (text) => {
        const formattedText = text.replace(/^/gm, '>')
        setCurrentText(currentText + formattedText + '\n\n');
        if (document.querySelector("textarea")) {
            document.querySelector("textarea").focus();
        }
    }

    const history = useHistory()
    const goBackHandler = () => {
        history.goBack();
    }

    const commentRendered = () => {
        let content = [<Spinner key="spinner" />];
        if (commentArray.length > 0) {
            content = [<Comments comments={commentArray} key="comments" onQuote={onQuoteHandler}/>]
            if (isAuth) {
                content.push(<CommentTextarea
                    valid={validInput}
                    text={currentText}
                    changeHandler={(event) => currentTextChangeHandler(event)}
                    submitHandler={submitComment}
                    keyPress={(event) => onKeyPress(event)}
                    preview={isPreview}
                    previewHandler={onPreviewHandler}
                    key="textarea" />);
            } else {
                content.push(<Link to={PATH.AUTH_PATH} key="loginPrompt"><p style={{ "textAlign": "center", "textDecoration": "underline" }}>登入帳號來參與討論</p></Link>)

            }
        }
        return content;
    }

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
            {showAlert.show && showAlertHandler(showAlert)}
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
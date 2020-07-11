import React, { useState, useRef, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import * as firebase from 'firebase/app';
import 'firebase/auth'
import moment from 'moment';
import { convertToRaw } from 'draft-js';
import draftToMarkdown from 'draftjs-to-markdown';

import '../../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import classes from './CreatePost.module.css';
import CommentTextarea from '../../Components/CommentTextarea/CommentTextarea';
import Alert from '../../Components/UI/Alert/Alert';
import TitleBar from '../../Components/UI/Nav/TitleBar/TitleBar';
import Input from '../../Components/UI/Input/Input';
import { faArrowLeft, faSignOutAlt, faSignInAlt } from '@fortawesome/free-solid-svg-icons';
import * as PATH from '../../constants/paths';
import { FIREBASE_CONFIG } from '../../constants/firebase';

const CreatePost = (props) => {

    const [showAlert, setShowAlert] = useState({ show: false, type: '', content: '' });
    const [currentTitle, setCurrentTitle] = useState('');
    const [currentText, setCurrentText] = useState('');
    const [validInput, setValidInput] = useState(true);
    const [isAuth, setIsAuth] = useState(false);
    const [isPreview, setIsPreview] = useState(false);

    const history = useHistory();
    const id = useRef();

    if (!firebase.apps.length) {
        firebase.initializeApp(FIREBASE_CONFIG);
    }
    var auth = firebase.auth();
    var database = firebase.database();

    if (!auth.currentUser) {
        history.goBack();
    }

    useEffect(() => {
        var unsubscribe = auth.onAuthStateChanged((user) => {
            if (user) {
                setIsAuth(true)
                if (!user.emailVerified) {
                    showAlertHandler({ type: 'Danger', content: '開POST前請先驗證電郵' })
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

    const createPostContent = (postId) => {
        const commentData = {
            author: auth.currentUser.displayName,
            content: currentText,
            timeStamp: moment.utc().format()
        }
        database.ref(`posts/postComments/${postId}`)
            .push(commentData
                , (error => {
                    if (error) {
                        console.log(error)
                        showAlertHandler({ type: 'Danger', code: error.code });
                    } else {
                        history.replace(PATH.POST_PATH + id.current);
                    }
                }));
    }

    const createPostDetail = (postId) => {

        database.ref(`posts/postList/${postId}`)
            .update({
                title: currentTitle,
                author: auth.currentUser.displayName
            }).then(() => {
                createPostContent(postId)
            }).catch(error => {
                showAlertHandler({ type: 'Danger', code: error.code });
            });
    }

    const getNextPostId = () => {
        database.ref('posts/postList').once('value').then((snapshot) => {
            if (snapshot.exists()) {
                id.current = Object.keys(snapshot.val()).length
            } else {
                id.current = 0
            }
            createPostDetail(id.current);
        }).catch(error => {
            showAlertHandler({ type: 'Danger', code: error.code });
        })
    };

    const submitPostHandler = () => {
        if (currentTitle.trim().length !== 0 && currentText.trim().length !== 0) {
            getNextPostId()
        } else {
            showAlertHandler({ type: 'Danger', content: '未發表，請確保標題和內文並非空白！' })
        }
    }

    const onKeyPress = () => {
        var keyPressed = window.event.keyCode;
        var ctrlPressed = window.event.ctrlKey;
        if (ctrlPressed && keyPressed === 13) {
            submitPostHandler();
        }
    }
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

    const onPreviewHandler = () => {
        setIsPreview(!isPreview);
    }

    const goBackHandler = () => {
        history.goBack();
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

    //   const formData = new FormData();
    //   formData.append('source',file)
    //   fetch(`https://imgst.art/api/1/upload/?key=d5eddb0f844d0e85de8b4216325b3d56&format=json`,{
    //       method: 'POST',
    //       body: formData
    //   })
    //   .then((response) => {
    //     return response.json()
    //   })
    //   .then((responseData) => {
    //       console.log(responseData);
    //   })
    //   .catch(error => {
    //       console.log('error:', error)
    //   })



    return (
        <React.Fragment>
            {showAlert.show && <Alert type={showAlert.type} code={showAlert.code}>{showAlert.content}</Alert>}
            <TitleBar left={[{ icon: faArrowLeft, onClick: goBackHandler }]} right={rightIconRendered()}>開Post</TitleBar>
            <div className={classes.CreatePost}>
                <Input
                    value={currentTitle}
                    placeholder="標題"
                    type="text"
                    onChange={(event) => setCurrentTitle(event.target.value)} />
                {false === true ?
                    <CommentTextarea
                        simple={true}
                        valid={validInput}
                        text={currentText}
                        preview={isPreview}
                        changeHandler={(event) => currentTextChangeHandler(event)}
                        submitHandler={submitPostHandler}
                        previewHandler={onPreviewHandler}
                        keyPress={(event) => onKeyPress(event)} />
                    :
                    <CommentTextarea
                        simple={false}
                        submitHandler={submitPostHandler}
                        onEditorStateChange={editorState => setCurrentText(draftToMarkdown(convertToRaw(editorState.getCurrentContent())))}
                    />
                }
            </div>
        </React.Fragment>
    )
}

export default CreatePost;

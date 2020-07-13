import React, { useState, useRef, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import * as firebase from 'firebase/app';
import 'firebase/auth'
import 'firebase/database'
import moment from 'moment';
import { convertToRaw, EditorState } from 'draft-js';
import { draftjsToMd } from 'draftjs-md-converter';

import '../../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import classes from './CreatePost.module.css';
import Select from '../../Components/UI/Select/Select';
import CommentTextarea from '../../Components/CommentTextarea/CommentTextarea';
import Alert from '../../Components/UI/Alert/Alert';
import TitleBar from '../../Components/UI/Nav/TitleBar/TitleBar';
import Input from '../../Components/UI/Input/Input';
import { faArrowLeft, faSignOutAlt, faSignInAlt } from '@fortawesome/free-solid-svg-icons';
import * as PATH from '../../constants/paths';
import { FIREBASE_CONFIG } from '../../constants/firebase';
import * as CONFIG from '../../constants/config/config';

const CreatePost = (props) => {

    const [showAlert, setShowAlert] = useState({ show: false, type: '', content: '' });
    const [currentTitle, setCurrentTitle] = useState('');
    const [currentText, setCurrentText] = useState('');
    const [validInput, setValidInput] = useState(true);
    const [isAuth, setIsAuth] = useState(false);
    const [isPreview, setIsPreview] = useState(false);
    const [editorState, setEditorState] = useState(EditorState.createEmpty());
    const [selectOptions, setSelectOptions] = useState({});
    const [selected, setSelected] = useState(0);

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

    //get categories
    useEffect(() => {
        database.ref(`posts/category`).once('value').then((snapshot) => {
            if (snapshot.exists()) {
                console.log(snapshot.val())
                let temp = snapshot.val().map((item, index) => {
                    return {
                        value: index,
                        label: item.name
                    }
                })
                setSelectOptions(temp)
            } else {
                //發生錯誤：無法讀取數據
            }
        });
    }, [database])


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
                author: auth.currentUser.displayName,
                category: selected
            }).then(() => {
                createPostContent(postId)
            }).catch(error => {
                showAlertHandler({ type: 'Danger', code: error.code });
            });
    }

    const readAndUpdatePostCounter = (postId) => {
        console.log(selected)
        database.ref(`posts/category/${selected}`).once('value').then((snapshot) => {
            if (snapshot.exists()) {
                database.ref(`posts/category/${selected}`)
                .update({
                    postcount: snapshot.val().postcount + 1
                }).then(() => {
                    createPostDetail(postId)
                }).catch(error => {
                    console.log('read1')
                        showAlertHandler({ type: 'Danger', content: '分類ID錯誤'});
                    });
            } else {
                console.log('read2')
                showAlertHandler({ type: 'Danger', content: '發生錯誤'});
            }
        }).catch(error => {
            console.log(error)
            showAlertHandler({ type: 'Danger', content: error.code });
        })
    }

    const getNextPostId = () => {
        database.ref('posts/postList').once('value').then((snapshot) => {
            if (snapshot.exists()) {
                id.current = Object.keys(snapshot.val()).length
            } else {
                id.current = 0
            }
            readAndUpdatePostCounter(id.current);
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

    // wysiwyg editor functions

    const onEditorStateChange = (es) => {
        setEditorState(es);
        setCurrentText(draftjsToMd(convertToRaw(es.getCurrentContent())));
    }

    // history

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

    return (
        <React.Fragment>
            {showAlert.show && <Alert type={showAlert.type} code={showAlert.code}>{showAlert.content}</Alert>}
            <TitleBar left={[{ icon: faArrowLeft, onClick: goBackHandler }]} right={rightIconRendered()}>開Post</TitleBar>
            <div className={classes.CreatePost}>
                <p>標題</p>
                <Input
                    value={currentTitle}
                    placeholder="標題"
                    type="text"
                    onChange={(event) => setCurrentTitle(event.target.value)} />
                <p>分類</p>
                <Select options={selectOptions} selectOnChange={(event) => setSelected(+event.target.value)} selectValue={+selected} />
                <p>內容</p>
                {CONFIG.USE_SIMPLE_EDITOR ?
                    <CommentTextarea
                        valid={validInput}
                        text={currentText}
                        preview={isPreview}
                        changeHandler={(event) => currentTextChangeHandler(event)}
                        submitHandler={submitPostHandler}
                        previewHandler={onPreviewHandler}
                        keyPress={(event) => onKeyPress(event)}
                        key="textarea" />
                    :
                    <CommentTextarea
                        submitHandler={submitPostHandler}
                        editorState={editorState}
                        onEditorStateChange={onEditorStateChange}
                        key="textarea"
                    />
                }
            </div>
        </React.Fragment>
    )
}

export default CreatePost;

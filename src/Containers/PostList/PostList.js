import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useHistory, useRouteMatch } from 'react-router-dom';
import * as firebase from "firebase/app";

import 'firebase/firebase-database';
import 'firebase/auth';
import classes from './PostList.module.css';

import PostListItem from '../../Components/PostListItem/PostListItem';
import TitleBar from '../../Components/UI/Nav/TitleBar/TitleBar';
import SideBar from './SideBar';
import Alert from '../../Components/UI/Alert/Alert';
import { faPlus, faSignInAlt, faBars, faSignOutAlt } from '@fortawesome/free-solid-svg-icons'
import { FIREBASE_CONFIG } from '../../constants/firebase';
import * as PATH from '../../constants/paths';
import Spinner from '../../Components/UI/Spinner/Spinner';

const PostList = (props) => {

    const [listOfPost, setListOfPost] = useState({});
    const [showSideDrawer, setShowSideDrawer] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const [categoryList, setCategoryList] = useState([]);
    const history = useHistory();
    const match = useRouteMatch();
    const postArray = [];

    // Initialize Firebase

    if (!firebase.apps.length) {
        firebase.initializeApp(FIREBASE_CONFIG);
    }
    const database = firebase.database();
    const auth = firebase.auth();
    const [isAuth, setIsAuth] = useState(auth.currentUser !== null);
    const notCategory = isNaN(match.params.categoryId);

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

    const signOut = useCallback(() => {
        auth.signOut().then(() => {
            setIsAuth(false);
        }).catch((error) => {
            console.log(error)
        });
    }, [auth]);

    const showAlertHandler = (options) => {
        const props = { type: '', content: '', code: '' };
        options = { ...props, ...options };
        setTimeout(() => { setShowAlert({ show: false, type: '', content: '', code: '' }) }, 3000);
        setShowAlert({ show: true, type: options.type, content: options.content, code: options.code })
    }

    useEffect(() => {
        setListOfPost({});
        var listOfPostRef = database.ref('posts/postList');
        if (notCategory) {
            listOfPostRef.on('value', (snapshot) => {//set up load all post listener
                if (snapshot.exists()) {
                    setListOfPost(snapshot.val());
                } else {
                    showAlertHandler({ type: 'Danger', content: '冇Post喎' });
                }
            });
        } else {
            listOfPostRef.orderByChild("category").equalTo(+match.params.categoryId).on("value", (snapshot) => {//set up load category post listener
                if (snapshot.exists()) {
                    setListOfPost(snapshot.val());
                } else {
                    showAlertHandler({ type: 'Danger', content: '冇呢個分類或者冇Post喎' });
                }
            });
        }

        return () => { listOfPostRef.off() }; //detach listener
    }, [database, match.params.categoryId, notCategory])

    //get categories
    useEffect(() => {
        database.ref(`posts/category`).once('value').then((snapshot) => {
            if (snapshot.exists()) {
                setCategoryList(snapshot.val())
            } else {
                showAlertHandler({ type: 'Danger', content: '冇任何分類喎' });
            }
        });
    }, [database])

    for (const key in listOfPost) {
        postArray.push({
            postId: key,
            title: listOfPost[key].title,
            author: listOfPost[key].author,
            categoryId: listOfPost[key].category,
            categoryName: categoryList[listOfPost[key].category].name
        })
    }

    const posts = postArray.reverse().map(item => {
        return (
            <PostListItem
                key={item.postId}
                title={item.title}
                author={item.author}
                id={item.postId}
                category={item.categoryName}
                categoryOnClick={(e) => {
                    if (!e) { e = window.event};
                    e.cancelBubble = true;
                    if (e.stopPropagation) e.stopPropagation();
                    history.push(PATH.CATEGORY_PATH + '/' + item.categoryId);
                }} />
        )
    })

    let titleBar = useRef();
    useEffect(() => {
        if (categoryList.length > 0) {
            titleBar.current = <TitleBar
                left={[{ icon: faBars, onClick: () => setShowSideDrawer(!showSideDrawer) }]}
                right={[{ icon: faSignInAlt, onClick: () => history.push(PATH.AUTH_PATH) }]}
                sideDrawerShow={showSideDrawer}
                sideDrawerOnClose={() => setShowSideDrawer(!showSideDrawer)}>
                {notCategory ? '主頁' : categoryList[+match.params.categoryId].name}</TitleBar>
            // {notCategory ? '主頁' : match.params.categoryId}</TitleBar>
            if (isAuth) {
                titleBar.current = <TitleBar
                    left={[{ icon: faBars, onClick: () => setShowSideDrawer(!showSideDrawer) }]}
                    right={[
                        { icon: faPlus, onClick: () => history.push(PATH.NEW_POST_PATH) },
                        { icon: faSignOutAlt, onClick: () => signOut() }
                    ]}
                    sideDrawerShow={showSideDrawer}
                    sideDrawerOnClose={() => setShowSideDrawer(!showSideDrawer)}>
                    {notCategory ? '主頁' : categoryList[+match.params.categoryId].name}
                    {/* {notCategory ? '主頁' : match.params.categoryId} */}
                </TitleBar>
            }
        }
    }, [categoryList, isAuth, history, match.params.categoryId, notCategory, showSideDrawer, signOut])

    return (
        <React.Fragment>
            {showAlert.show && <Alert type={showAlert.type} code={showAlert.code}>{showAlert.content}</Alert>}
            {titleBar.current}
            <div className={classes.MainContent}>
                <div className={classes.LeftColumn}>
                    <div className={classes.PostList}>
                        {postArray.length > 0 ?
                            <div className={classes.Posts}>
                                {posts}
                            </div>
                            : <Spinner />}
                    </div>
                </div>
                <div className={classes.RightColumn}>
                    <SideBar></SideBar>
                </div>
            </div>

        </React.Fragment>
    )
}

export default PostList;
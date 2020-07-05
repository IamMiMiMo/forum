import React, { useState, useEffect } from 'react';
import { useHistory, useRouteMatch } from 'react-router-dom';
import * as firebase from "firebase/app";

import 'firebase/firebase-database';
import 'firebase/auth';
import classes from './PostList.module.css';

import PostListItem from '../../Components/PostListItem/PostListItem';
import TitleBar from '../../Components/UI/TitleBar/TitleBar';
import { faPlus, faSignInAlt, faBars, faSignOutAlt } from '@fortawesome/free-solid-svg-icons'
import { FIREBASE_CONFIG } from '../../constants/firebase';
import * as PATH from '../../constants/paths';
import Spinner from '../../Components/UI/Spinner/Spinner';

const PostList = (props) => {

    const [listOfPost, setListOfPost] = useState({});
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

    useEffect(() => {
        var listOfPostRef = database.ref('posts/postList');
        listOfPostRef.on('value', function (snapshot) {//set up listener
            if (snapshot.exists()) {
                setListOfPost(snapshot.val());
            }else {
                console.log("no post")
            }
        });

        return () => { listOfPostRef.off() }; //detach listener
    }, [database, match.params.id])

    for (const key in listOfPost) {
        postArray.push({
            postId: key,
            title: listOfPost[key].title,
            author: listOfPost[key].author
        })
    }

    const posts = postArray.reverse().map(item => {
        return (
            <PostListItem key={item.postId} title={item.title} author={item.author} id={item.postId} />
        )
    })

    let titleBar = <TitleBar
        left={[{ icon: faBars, onClick: () => history.push(PATH.HOME_PATH) }]}
        right={[{ icon: faSignInAlt, onClick: () => history.push(PATH.AUTH_PATH) }]}>
        主頁</TitleBar>
    if (isAuth) {
        titleBar = <TitleBar
            left={[{ icon: faBars, onClick: () => history.push(PATH.HOME_PATH) }]}
            right={[
                { icon: faPlus, onClick: () => history.push(PATH.NEW_POST_PATH) },
                { icon: faSignOutAlt, onClick: () => signOut() }
            ]}>
            主頁
        </TitleBar>
    }

    return (
        <React.Fragment>
            {titleBar}
            <div className={classes.PostList}>
                {postArray.length > 0 ?
                    <div className={classes.Posts}>
                        {posts}
                    </div>
                    : <Spinner />}
            </div>
        </React.Fragment>
    )
}

export default PostList;
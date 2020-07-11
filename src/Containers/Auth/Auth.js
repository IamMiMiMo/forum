import React, { useState } from 'react'
import { useHistory, useLocation } from 'react-router-dom';
import * as firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';

import Alert from '../../Components/UI/Alert/Alert';
import AuthForm from '../../Components/AuthForm/AuthForm';
import TitleBar from '../../Components/UI/Nav/TitleBar/TitleBar';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { FIREBASE_CONFIG } from '../../constants/firebase';

const Auth = () => {

    const [isRegister, setIsRegister] = useState(false);

    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setconfirmPassword] = useState('');

    const [showAlert, setShowAlert] = useState(false);
    const location = useLocation();

    const history = useHistory();
    if (location.state !== undefined) {
        setIsRegister(location.state.isReg);
    }

    if (!firebase.apps.length) {
        firebase.initializeApp(FIREBASE_CONFIG);
    }
    const auth = firebase.auth();
    const database = firebase.database();

    //check login ed
    const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
        if (user) {
            unsubscribe();
            history.goBack();
        } else {
            unsubscribe();
        }
    });

    const onChangeAuthHandler = () => {
        setIsRegister(!isRegister);
    }

    const goBackHandler = () => {
        history.goBack();
    }

    const showAlertHandler = (options) => {
        const props = { type: '', content: '', code: '' };
        options = {...props, ...options};
        setTimeout(() => { setShowAlert({ show: false, type: '', content: '', code: '' }) }, 3000);
        setShowAlert({ show: true, type: options.type, content: options.content, code: options.code })
    }

    const checkUserName = (uname) => {
        database.ref('users/usernames/' + uname).once('value')
            .then(snapshot => {
                if (snapshot.val()) {
                    showAlertHandler({ type: 'Danger', content: '用戶名稱已存在'})
                } else {
                    console.log('createAccount')
                    createAccountInAuth(uname);
                }
            })
            .catch(error => {
                showAlertHandler({ type: 'Danger', code: error.code })
            })

    }

    const createAccountInAuth = (uname) => {
        auth.createUserWithEmailAndPassword(email, password).then((result) => {
            console.log(result.user.uid);
            result.user.sendEmailVerification(); //send verification email
            storeAccountDetailInDatabase(result.user.uid, uname)

        }).catch((error) => {
            showAlertHandler({ type: 'Danger', code: error.code })
        });
    }

    const storeAccountDetailInDatabase = (uid, uname) => {
        database.ref(`users/userlist/${uid}`)
            .update({
                username: uname
            }, (error => {
                if (error) {
                    showAlertHandler({ type: 'Danger', content: error.code });
                } else {
                    database.ref('users/usernames')
                        .update({
                            [uname]: uid
                        }).then(() => {
                            console.log(auth.currentUser.displayName)
                            auth.currentUser.updateProfile({
                                displayName: uname //set display name in auth
                            }).then(() => {
                                history.goBack()
                            }).catch((error) => {
                                showAlertHandler({ type: 'Danger', content: error.code })
                            })
                        }).catch(error => {
                            if (error) {
                                showAlertHandler({ type: 'Danger', content: error.code });
                            }
                        });
                }
            }));

    }

    const onSubmitHandler = () => {

        if (isRegister) {
            if (username && email && password && confirmPassword) {
                if (password === confirmPassword) {
                    checkUserName(username);
                } else {
                    showAlertHandler({ type: 'Danger', content: '密碼與確認密碼不相同' })
                }
            } else {
                showAlertHandler({ type: 'Danger', content: '請確保所有欄位已填寫' })
            }
        } else {
            if (email && password) {
                auth.signInWithEmailAndPassword(email, password)
                    .then(() => {
                        history.goBack()
                    })
                    .catch((error) => {
                        showAlertHandler({ type: 'Danger', code: error.code })
                    });
            } else {
                showAlertHandler({ type: 'Danger', content: '請確保所有欄位已填寫' })
            }
        }
    }



    return (
        <React.Fragment>
            {showAlert.show && <Alert type={showAlert.type} code={showAlert.code}>{showAlert.content}</Alert>}
            <TitleBar left={[{ icon: faArrowLeft, onClick: goBackHandler }]} right={[]}>
                {isRegister ? '註冊' : '登入'}
            </TitleBar>
            <AuthForm
                register={isRegister}
                usernameChanged={(event) => setUsername(event.target.value)}
                emailChanged={(event) => setEmail(event.target.value)}
                passwordChanged={(event) => setPassword(event.target.value)}
                confirmPasswordChanged={(event) => setconfirmPassword(event.target.value)}
                onSubmit={onSubmitHandler}
                changeAuth={onChangeAuthHandler} />
        </React.Fragment>
    )

}

export default Auth;


import React, { useState } from 'react'
import { useHistory, useLocation } from 'react-router-dom';
import * as firebase from 'firebase/app';
import 'firebase/auth';

import Alert from '../../Components/UI/Alert/Alert';
import AuthForm from '../../Components/AuthForm/AuthForm';
import TitleBar from '../../Components/UI/TitleBar/TitleBar';
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

    const onSubmitHandler = () => {
        if (isRegister) {
            if (username && email && password && confirmPassword) {
                if (password === confirmPassword) {
                    auth.createUserWithEmailAndPassword(email, password).then((result) => {
                        console.log(result);
                        result.user.sendEmailVerification();
                        result.user.updateProfile({
                            displayName: username
                        }).then(() => {
                            history.goBack()
                        }).catch((error) => {
                            setTimeout(() => setShowAlert({ show: false, type: '', content: '' }), 3000);
                            setShowAlert({ show: true, type: 'Danger', content: `註冊失敗，發生錯誤：${error}` })
                        });
                    }).catch((error) => {
                        setTimeout(() => setShowAlert({ show: false, type: '', content: '' }), 3000);
                        setShowAlert({ show: true, type: 'Danger', content: `發生錯誤，錯誤編號：${error.code} - ${error.message}` })
                    });
                } else {
                    setTimeout(() => setShowAlert({ show: false, type: '', content: '' }), 3000);
                    setShowAlert({ show: true, type: 'Danger', content: '發生錯誤：密碼與確認密碼不相同' })
                }
            } else {
                setTimeout(() => setShowAlert({ show: false, type: '', content: '' }), 3000);
                setShowAlert({ show: true, type: 'Danger', content: '發生錯誤：請確保所有欄位已填寫' })
            }
        } else {
            if (email && password) {
                auth.signInWithEmailAndPassword(email, password)
                    .then(() => {
                        history.goBack()
                    })
                    .catch((error) => {
                        setShowAlert({ show: true, type: 'Danger', content: `發生錯誤，錯誤編號：${error.code} - ${error.message}` })
                    });
            } else {
                setTimeout(() => setShowAlert({ show: false, type: '', content: '' }), 3000);
                setShowAlert({ show: true, type: 'Danger', content: '發生錯誤：請確保所有欄位已填寫' })
            }
        }
    }



    return (
        <React.Fragment>
            <TitleBar left={[{ icon: faArrowLeft, onClick: goBackHandler }]} right={[]}>
                {isRegister ? '註冊' : '登入'}
            </TitleBar>
            {showAlert.show && <Alert type={showAlert.type}>{showAlert.content}</Alert>}
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


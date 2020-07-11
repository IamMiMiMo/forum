import React from 'react'
import classes from './Alert.module.css'

const alert = (props) => {

    const classList = [classes.Alert];
    switch (props.type) {
        case "Success":
            classList.push(classes.Success);
            break;
        case "Danger":
            classList.push(classes.Danger);
            break;
        default:
            break;
    }

    let content = '';
    switch (props.code) {
        //firebase database error
        case "PERMISSION_DENIED":
            content = '沒有權限讀取數據，請確保已登入及已驗證電郵';
            break;
        case "DISCONNECTED":
            content = '沒有網絡連接，請確保有穩定網絡連線';
            break;
        case "EXPIRED_TOKEN":
            content = '登入時效已過，請刷新頁面並重新登入';
            break;
        case "INVALID_TOKEN":
            content = '登入無效，請刷新頁面並重新登入';
            break;
        case "NETWORK_ERROR":
            content = '網絡錯誤，請確保有穩定網絡連線';
            break;
        //firebase auth error
        case "auth/wrong-password":
            content = '無效帳號或密碼組合';
            break;
        case "auth/user-not-found":
            content = '無效帳號或密碼組合';
            break;
        case "account-exists-with-different-credential":
            content = '此帳號已存在';
            break;
        case "auth/invalid-credential":
            content = '無效帳號或密碼組合';
            break;
        case "auth/user-disabled":
            content = '帳號已被停用，如有需要請聯系管理員';
            break;
        case "auth/user-token-expired":
            content = '登入無效，請刷新頁面並重新登入';
            break;
        case "auth/too-many-requests":
            content = '限時內發送過多請求，請稍後再試';
            break;
        case "auth/network-request-failed":
            content = '網絡錯誤，請確保有穩定網絡連線';
            break;
        case "auth/invalid-user-token":
            content = '登入無效，請刷新頁面並重新登入';
            break;
        case "":
            content = props.children;
            break;
        default:
            content = props.code;
            break;
    }

    return (
        <div className={classList.join(' ')}>
            {content}
        </div>
    )
}

export default alert;

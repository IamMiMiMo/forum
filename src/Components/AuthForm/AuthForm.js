import React from 'react';

import Input from '../UI/Input/Input';
import Button from '../UI/Button/Button';
import classes from './AuthForm.module.css';

const authForm = (props) => {

    let form = '';
    if (props.register) {
        form = (
            <form className={classes.AuthFormInner}>
                <h2>註冊</h2>
                <label>用戶名稱</label>
                <Input onChange={props.usernameChanged} type="text" />
                <label>電郵(需用於電郵認證)</label>
                <Input onChange={props.emailChanged} type="text" />
                <label>密碼</label>
                <Input onChange={props.passwordChanged} type="password" />
                <label>確認密碼</label>
                <Input onChange={props.confirmPasswordChanged} type="password" />
                <Button type="Success" onClick={props.onSubmit}>註冊</Button>
            </form>
        )
    } else {
        form = (
            <form className={classes.AuthFormInner}>
                <h2>登入</h2>
                <label>電郵</label>
                <Input onChange={props.emailChanged} type="text" />
                <label>密碼</label>
                <Input onChange={props.passwordChanged} type="password" />
                <Button type="Success" onClick={props.onSubmit}>登入</Button>
            </form>
        )
    }

    return (
        <div className={classes.AuthForm}>
            {form}
            <p className={classes.Switch} onClick={props.changeAuth}>不是{props.register ? '註冊' : '登入'}? 按此{props.register ? '登入' : '註冊'}</p>
        </div>
    )
}

export default authForm;

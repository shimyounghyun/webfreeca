import React from 'react';
import styles from "./RegisterForm.scss";
import classNames from "classnames/bind";

const cx = classNames.bind(styles);

const RegisterForm = () => {
    return (
        <div className={cx("wrapper")}>
            <div className={cx("form")}>
                <div className={cx("title")}></div>
                <input type="text" name="id" id="userId" placeholder="아이디"/>
                <input type="text" name="pw" id="userPw" placeholder="비밀번호"/>
                <input type="text" name="userName" id="userName" placeholder="닉네임"/>
            </div>
        </div>
    );
}

export default RegisterForm;
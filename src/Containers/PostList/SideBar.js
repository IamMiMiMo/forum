import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import * as firebase from "firebase/app";

import 'firebase/firebase-database';
import * as classes from './SideBar.module.css';
import * as PATH from '../../constants/paths';

const RightColumn = () => {

    const [listOfCategory, setListOfCategory] = useState([]);
    const database = firebase.database();


    //get post title
    useEffect(() => {
        database.ref(`posts/category`).once('value').then((snapshot) => {
            if (snapshot.exists()) {
                setListOfCategory(snapshot.val())
            } else {
                //發生錯誤：無法讀取數據
            }
        });
    }, [database])

    let output = listOfCategory.map((item, index) => {
        return <li key={index}><Link to={PATH.CATEGORY_PATH + '/' + index}>{item}</Link></li>
    })

    return (
        <div className={classes.SideBar}>
            <h3 style={{textAlign: 'center'}}>分類</h3>
            <ul>
                <li><Link to={PATH.POST_LIST_PATH}>全部</Link></li>
                {output}
            </ul>
        </div>
    )
}

export default RightColumn;

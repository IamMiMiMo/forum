import React, { useEffect, useState, memo } from 'react';
import { useHistory } from 'react-router-dom';
import * as firebase from "firebase/app";

import 'firebase/firebase-database';
import * as classes from './SideBar.module.css';
import * as PATH from '../../constants/paths';
import CategoryCard from '../../Components/UI/CategoryCard/CategoryCard';

const RightColumn = memo((props) => {

    const [listOfCategory, setListOfCategory] = useState([]);
    const database = firebase.database();
    const history = useHistory();

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

    let count = 0;
    let output = listOfCategory.map((item, index) => {
        count += item.postcount;
        return <CategoryCard
            key={index}
            icon={item.icon}
            name={item.name}
            count={item.postcount}
            clicked={() => {
                props.setLoading()
                history.push(PATH.CATEGORY_PATH + '/' + index)}
            } />
    })

    return (
        <div className={classes.SideBar}>
            <div className={classes.Categorys}>
                <h3 style={{ textAlign: 'center' }}>分類</h3>
                <CategoryCard
                    key='all'
                    icon="https://image.flaticon.com/icons/svg/2928/2928865.svg"
                    name='全部'
                    count={count}
                    clicked={() => {
                        props.setLoading()
                        history.push(PATH.POST_LIST_PATH)}
                    } />
                {output}
            </div>
        </div>
    )
})

export default RightColumn;

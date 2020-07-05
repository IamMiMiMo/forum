import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'

import classes from './TitleBar.module.css';

const titleBar = (props) => {

    //receive left & right : [{icon: iconName1, onClick: action1}, {icon: iconName2, onClick: action2}...]
    let largerArray = props.right;
    let smallerArray = props.left
    if (Object.keys(props.left) > Object.keys(props.right)) { // check which larger
        largerArray = props.left;
        smallerArray = props.right;
    }
    for (let i = 0; i < (largerArray.length - smallerArray.length); i++) {
        if (smallerArray === props.left) { //if left hand side has less icons
            props.left.push({ icon: 'none', action: () => { } }) // put empty icon at last
        } else {
            props.right.unshift({ icon: 'none', action: () => { } }) // put empty icon at front if right hand side has more icons
        }
    }
    let leftIconRendered = props.left.map((item) => {
        if (item.icon !== 'none') {
            return (
                <span className={classes.LeftIcon} onClick={item.onClick} key={Math.random()}><FontAwesomeIcon icon={item.icon} /></span>
            )
        } else {
            return (
                <span className={classes.LeftIcon} style={{ 'visibility': 'hidden' }} key={Math.random()}><FontAwesomeIcon icon={faArrowLeft} /></span>
            )
        }
    })
    let rightIconRendered = props.right.map((item) => {
        if (item.icon !== 'none') {
            return (
                <span className={classes.RightIcon} onClick={item.onClick} key={Math.random()}><FontAwesomeIcon icon={item.icon} /></span>
            )
        } else {
            return (
                <span className={classes.RightIcon} style={{ 'visibility': 'hidden' }} key={Math.random()}><FontAwesomeIcon icon={faArrowLeft} /></span>
            )
        }
    })
    return (
        <React.Fragment>
            <div id="titleBar" className={[classes.TitleBar, classes.Dark].join(' ')}>
                <div className={classes.InnerTitleBar}>
                    <div id="leftIconBar">{leftIconRendered}</div>
                    <span id="titleBarText">{props.children}</span>
                    <div id="rightIconBar">{rightIconRendered}</div>
                </div>
            </div>
            {/* <div className={classes.Placeholder}></div> */}
        </React.Fragment>
    )
}
// const scrollFunction = () => {
//     if (document.getElementById("titleBar")) {
//         if (document.body.scrollTop > 50 || document.documentElement.scrollTop > 50) {
//             document.getElementById("titleBar").style.fontSize = "1rem";
//         } else {
//             document.getElementById("titleBar").style.fontSize = "1.25rem";
//         }
//     }
// }

// window.onscroll = scrollFunction;

export default titleBar;

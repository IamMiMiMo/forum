import React from 'react';
import classes from './SideDrawer.module.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faShapes, faFire, faChartLine, faMapSigns } from '@fortawesome/free-solid-svg-icons';

const SideDrawer = (props) => {
    return (

        props.show ?
            < div className={classes.SideDrawer} >
                <div className={classes.SideDrawerInner}>
                    <div>
                        <p><FontAwesomeIcon icon={faShapes} /> 分類</p>
                        <div className={classes.MenuItemInner}>
                            <a href="/category/1">Trash Talk</a>
                            <a href="/category/1">Trash Talk 2</a>
                        </div>
                    </div>
                    <div>
                        <p><FontAwesomeIcon icon={faFire} /> 熱門主題</p>
                        <div className={classes.MenuItemInner}>
                        </div>
                    </div>
                    <div>
                        <p><FontAwesomeIcon icon={faChartLine} /> 統計數量</p>
                        <div className={classes.MenuItemInner}>
                        </div>
                    </div>
                    <div>
                        <p><FontAwesomeIcon icon={faMapSigns} /> 導航</p>
                        <div className={classes.MenuItemInner}>
                        </div>
                    </div>
                </div>
                <div className={classes.SideDrawerClose} onClick={props.onClose}><FontAwesomeIcon icon={faTimes} /></div>
            </div >
            :
            null

    )
}

export default SideDrawer;

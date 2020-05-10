import React from 'react';
import {NavLink, useLocation} from 'react-router-dom';

import arrowRightIMG from 'common/assets/arrowRight.svg';

import styles from './navEl.module.scss';

const NavEl = ({
    text,
    to,
    img
}) => {
    const {pathname} = useLocation();
    return (
        <NavLink to={to} className={styles.container} activeClassName={styles.active} >
            <img className={styles.img} src={img} />
            <span className={styles.text}>{text}</span>
            {pathname === to && <img className={styles.arrow} src={arrowRightIMG} />}
        </NavLink>
    )
}

export default NavEl;
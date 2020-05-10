import React from 'react';
import LogoIMG from 'common/assets/logo.svg';

import styles from './logo.module.scss';

const Logo = () => (
    <div className={styles.container}>
        <img className={styles.img} src={LogoIMG} />
        <span>NLP-Control</span>
    </div>
)

export default Logo;
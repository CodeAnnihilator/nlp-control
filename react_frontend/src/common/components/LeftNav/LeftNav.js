import React from 'react';

import Logo from './Frames/Logo';
import NavEL from './Frames/NavEl';

import dashIMG from 'common/assets/dash.svg';
import backupsIMG from 'common/assets/backups.svg';
import settingsIMG from 'common/assets/settings.svg';
import apiDocsIMG from 'common/assets/apiDocs.svg';

import styles from './leftNav.module.scss';

const LeftNav = () => (
    <div className={styles.container}>
        <Logo />
        <ul className={styles.navContainer}>
            <NavEL to='/dashboard' text='Dashboart' img={dashIMG} />
            <NavEL to='/backups' text='Backups' img={backupsIMG} />
            <NavEL to='/settings' text='Settings' img={settingsIMG} />
            <NavEL to='/docs' text='API Docs' img={apiDocsIMG} />
        </ul>
    </div>
)

export default LeftNav;
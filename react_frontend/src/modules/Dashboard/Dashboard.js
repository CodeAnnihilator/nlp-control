import React from 'react';

import IndicatedParam from './Frames/IndicatedParam';
import ControlButton from './Frames/ControlButton';

import intentsIMG from 'common/assets/intents.svg';
import languagesIMG from 'common/assets/languages.svg';
import collectionsIMG from 'common/assets/collections.svg';
import issuesIMG from 'common/assets/issues.svg';

import styles from './dashboard.module.scss';

const Dashboard = () => (
    <>
        <div className={styles.header}>
            <IndicatedParam img={intentsIMG} value={210} growth={15} text='INTENTS'/>
            <IndicatedParam img={languagesIMG} value={4} growth={1} text='LANGUAGES'/>
            <IndicatedParam img={collectionsIMG} value={28} growth={7} text='COLLECTIONS'/>
            <IndicatedParam img={issuesIMG} value={18} growth={12} text='ISSUES'/>
        </div>
        <div className={styles.controls}>
            <ControlButton text='VALIDATE DATA' />
            <ControlButton text='TRAIN NETWORK' disabled/>
        </div>
        <div className={styles.console}>
            asdasd
        </div>
    </>
)

export default Dashboard;
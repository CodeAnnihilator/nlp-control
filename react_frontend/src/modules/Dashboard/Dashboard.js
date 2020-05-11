import React, { useEffect, useRef } from 'react';

import IndicatedParam from './Frames/IndicatedParam';
import ControlButton from './Frames/ControlButton';

import intentsIMG from 'common/assets/intents.svg';
import languagesIMG from 'common/assets/languages.svg';
import collectionsIMG from 'common/assets/collections.svg';
import issuesIMG from 'common/assets/issues.svg';

import styles from './dashboard.module.scss';

const Dashboard = ({
    logs,
    issues,
    collections,
    languages
}) => {
    const containerRef = useRef(null);
    const logsRefs= useRef([]);
    useEffect(() => {
        const current = logsRefs.current.slice(-1)[0];
        if (current) {
            containerRef.current.scrollTo(0, current.offsetTop)
        }
    }, [logs])
    return (
        <>
            <div className={styles.header}>
                <IndicatedParam img={intentsIMG} value={210} text='INTENTS'/>
                <IndicatedParam img={languagesIMG} value={languages} text='LANGUAGES'/>
                <IndicatedParam img={collectionsIMG} value={collections} text='COLLECTIONS'/>
                <IndicatedParam img={issuesIMG} value={issues} text='ISSUES'/>
            </div>
            <div className={styles.controls}>
                <ControlButton text='VALIDATE DATA' />
                <ControlButton text='TRAIN NETWORK' disabled/>
            </div>
            <div ref={containerRef} className={styles.consoleWrapper}>
                <div className={styles.console}>
                    {
                        logs.map(({type, message}, index) =>
                            <span
                                ref={el => (logsRefs.current[index] = el)}
                                key={`log-${index}`}
                                className={styles[type]}
                            >
                                {message}
                            </span>
                        )
                    }
                </div>
            </div>
        </>
    )
}

export default Dashboard;
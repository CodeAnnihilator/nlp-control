import React from 'react';

import styles from './indicatedParam.module.scss';

const IndicatedParam = ({
    img,
    value,
    growth,
    text
}) => (
    <div className={styles.container}>
        <img className={styles.img} src={img} />
        <span>
            <span className={styles.value}>{value}</span>
            <span className={styles.growth}>{growth > 0 ? `(+${growth})` : `(-${growth})`}</span>
        </span>
        <span className={styles.text}>{text}</span>
    </div>
)

export default IndicatedParam;
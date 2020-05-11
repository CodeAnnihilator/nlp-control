import React from 'react';
import cn from 'classnames';

import styles from './controlButton.module.scss';

const ControlButton = ({
    text,
    onClick,
    disabled=false
}) => (
    <div onClick={onClick} className={cn(styles.container, {[styles.disabled]: disabled})}>
        {text}
    </div>
)

export default ControlButton;
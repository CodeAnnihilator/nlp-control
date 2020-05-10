import React from 'react';
import cn from 'classnames';

import styles from './controlButton.module.scss';

const ControlButton = ({
    text,
    disabled=false
}) => (
    <div className={cn(styles.container, {[styles.disabled]: disabled})}>{text}</div>
)

export default ControlButton;
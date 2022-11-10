import React from 'react';
import styles from './NotFound.module.css'

const NotFound = ({ value }) => {
    return (
        <div className={styles.notFound}>
            <h1 className={styles.text}>sorry this {value} dosen't exist.</h1>
        </div>
    );
};

export default NotFound;
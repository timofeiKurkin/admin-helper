import React from 'react'
import styles from "./LoadingCircle.module.scss"

const LoadingCircle = () => {
    return (
        <div className={styles.loaderWrapper}>
            <div className={styles.loader}></div>
        </div>
    )
}

export default LoadingCircle
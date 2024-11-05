import React, { FC } from 'react';
import { blue_dark, white_1 } from "@/styles/colors";
import styles from "./Checkbox.module.scss"

interface PropsType {
    toggleStatus: boolean;
    isError?: boolean;
}

const Checkbox: FC<PropsType> = ({ toggleStatus, isError }) => {
    return (
        <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" className={`${isError && styles.checkboxError}`}>
            <rect x="0.5" y="0.5" width="14" height="14" rx="4.5" className={styles.checkboxBackground} />
            <rect x="3" y="3" width="9" height="9" rx="2" className={`${styles.checkboxRect} ${!toggleStatus && styles.checkboxOFF}`} />
        </svg>

    );
};

export default Checkbox;
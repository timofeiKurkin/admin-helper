import React, {FC} from 'react';
import {blue_dark, white_1} from "@/styles/colors";
import styles from "./Checkbox.module.scss"

interface PropsType {
    toggleStatus: boolean;
}

const Checkbox: FC<PropsType> = ({toggleStatus}) => {

    return (
        <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="0.5" y="0.5" width="14" height="14" rx="4.5" fill={white_1} stroke={blue_dark}/>
            <rect x="3" y="3" width="9" height="9" rx="2" fill={blue_dark} className={toggleStatus ? styles.checkboxON : styles.checkboxOFF}/>
        </svg>

    );
};

export default Checkbox;
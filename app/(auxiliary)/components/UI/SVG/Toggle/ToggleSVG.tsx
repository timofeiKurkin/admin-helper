"use client"

import React, {FC, useState} from 'react';
import styles from "./ToggleSVG.module.scss";

interface PropsType {
    toggleStatus: boolean;
}

const ToggleSVG: FC<PropsType> = ({toggleStatus}) => {

    return (
        <svg width="23" height="23"
             viewBox="0 0 23 23"
             fill="none"
             xmlns="http://www.w3.org/2000/svg">
            <path
                d="M7.1875 5.0375H15.8125C19.3817 5.0375 22.275 7.93142 22.275 11.5C22.275 15.0686 19.3817 17.9625 15.8125 17.9625H7.1875C3.6183 17.9625 0.725 15.0686 0.725 11.5C0.725 7.93142 3.6183 5.0375 7.1875 5.0375Z"
                className={toggleStatus ? styles.toggleON : styles.toggleOFF}
                strokeWidth="1.45"/>
            <path fillRule="evenodd" clipRule="evenodd"
                  d="M15.8225 14.1875C14.2348 14.1875 12.9475 12.9002 12.9475 11.3125C12.9475 9.72478 14.2348 8.4375 15.8225 8.4375C17.4102 8.4375 18.6975 9.72478 18.6975 11.3125C18.6975 12.9002 17.4102 14.1875 15.8225 14.1875ZM15.8225 7C13.4413 7 11.51 8.93128 11.51 11.3125C11.51 13.6937 13.4413 15.625 15.8225 15.625C18.2044 15.625 20.135 13.6937 20.135 11.3125C20.135 8.93128 18.2044 7 15.8225 7Z"
                  className={toggleStatus ? styles.ellipseON : styles.ellipseOFF}/>
        </svg>
    );
};

export default ToggleSVG;
import React, {FC} from 'react';
import {white_1} from "@/styles/colors";
import styles from "./UploadFile.module.scss";

interface PropsType {
    animationStatus: boolean;
}

const UploadFile: FC<PropsType> = ({animationStatus}) => {
    return (
        <svg width="290" height="290" overflow="visible" viewBox="0 0 290 290" fill="none" xmlns="http://www.w3.org/2000/svg" className={`${styles.svgStyles} ${animationStatus && styles.animateSVG}`}>
            <g clipPath="url(#clip0_2002_486)">
                <path fillRule="evenodd" clipRule="evenodd"
                      d="M242.667 156C233.099 156 225.333 163.766 225.333 173.334V208H34.6667V173.334C34.6667 163.766 26.9013 156 17.3333 156C7.76533 156 0 163.766 0 173.334V234C0 238.152 4.51533 242.667 8.66667 242.667H251.333C256.568 242.667 260 238.698 260 234V173.334C260 163.766 252.235 156 242.667 156Z"
                      fill={white_1}/>
                <path
                    d="M147.604 112.636H164.937C168.335 112.636 176.161 111.812 179.558 115.235C182.956 118.641 182.956 124.18 179.558 127.594L136.719 179.516C134.908 181.336 132.507 182.116 130.132 181.986C127.766 182.116 125.365 181.336 123.545 179.516L80.7062 127.594C77.3175 124.18 77.3175 118.641 80.7062 115.235C84.1122 111.812 89.5028 112.636 95.6041 112.636H112.937V34.6356C112.937 25.0676 120.703 17.3022 130.271 17.3022C139.839 17.3022 147.604 25.0676 147.604 34.6356V112.636Z"
                    className={animationStatus ? styles.arrowPullUp : styles.arrowDefault}
                    // className={styles.animateSVG}
                    fill={white_1}/>
            </g>
        </svg>
    );
};

export default UploadFile;
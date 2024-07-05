import React, {FC} from 'react';
import {blue_dark, white, white_1} from "@/styles/colors";
import styles from "./Chevron.module.scss";

interface PropsType {
    toggleStatus: boolean;
}

const Chevron: FC<PropsType> = ({toggleStatus}) => {
    return (
        <svg width="11"
             height="11"
             viewBox="0 0 11 11"
             fill="none"
             xmlns="http://www.w3.org/2000/svg"
             className={toggleStatus ? styles.chevronRotate : styles.chevronInitial}>
            <g clipPath="url(#clip0_14_123)">
                <path fillRule="evenodd" clipRule="evenodd"
                      d="M10.7273 2.35126C10.3474 1.97084 9.73043 1.97084 9.35047 2.35126L5.50734 6.59084L1.66377 2.35126C1.28381 1.97084 0.66688 1.97084 0.286922 2.35126C-0.0930364 2.73168 -0.0930364 3.35043 0.286922 3.73085L4.75797 8.66252C4.96376 8.86877 5.2383 8.96043 5.50734 8.9421C5.77639 8.96043 6.05048 8.86877 6.25628 8.66252L10.7273 3.73085C11.1073 3.35043 11.1073 2.73168 10.7273 2.35126Z"
                      fill={blue_dark}/>
            </g>
            <defs>
                <clipPath id="clip0_14_123">
                    <rect width="11" height="11" fill={white}/>
                </clipPath>
            </defs>
        </svg>

    );
};

export default Chevron;
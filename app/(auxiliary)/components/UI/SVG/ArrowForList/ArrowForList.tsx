import React, {FC} from 'react';
import {blue_dark, grey} from "@/styles/colors";

interface PropsType {
    activeStatus: boolean;
    className: string;
}

const ArrowForList: FC<PropsType> = ({activeStatus, className}) => {

    return (
        <svg
            width={10}
            height={10}
            viewBox="0 0 10 10"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
        >
            <g clipPath="url(#clip0_2332_2366)">
                <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M1.28 5.516L8.065 9.89c.403.217.864.194.864-.584V.695c0-.711-.495-.824-.864-.584L1.28 4.484a.741.741 0 000 1.032z"
                    fill={activeStatus ? blue_dark : grey}
                />
            </g>
            <defs>
                <clipPath id="clip0_2332_2366">
                    <path fill="#fff" transform="rotate(180 5 5)" d="M0 0H10V10H0z"/>
                </clipPath>
            </defs>
        </svg>
    )
};

export default ArrowForList;
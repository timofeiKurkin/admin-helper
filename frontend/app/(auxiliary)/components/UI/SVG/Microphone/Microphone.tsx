import React from 'react';
import {white_1} from "@/styles/colors";
import styles from "./Microphone.module.scss";


const Microphone = () => {
    return (
        <svg fill="none"
             viewBox="0 0 21 20"
             xmlns="http://www.w3.org/2000/svg"
             className={styles.microphone}>
            <path fillRule="evenodd" clipRule="evenodd"
                  d="M10.5 15C13.0371 15 15.0938 13.0413 15.0938 10.625V4.375C15.0938 1.95875 13.0371 0 10.5 0C7.96294 0 5.90625 1.95875 5.90625 4.375V10.625C5.90625 13.0413 7.96294 15 10.5 15ZM17.7188 11.875H16.4062C15.8084 14.3794 13.3101 16.25 10.5 16.25C7.68994 16.25 5.19159 14.3794 4.59375 11.875H3.28125C3.86072 14.8744 6.60384 17.1937 9.84375 17.4719V18.75H9.1875C8.82525 18.75 8.53125 19.03 8.53125 19.375C8.53125 19.7206 8.82525 20 9.1875 20H11.8125C12.1748 20 12.4688 19.7206 12.4688 19.375C12.4688 19.03 12.1748 18.75 11.8125 18.75H11.1562V17.4719C14.3962 17.1937 17.1393 14.8744 17.7188 11.875Z"
                  fill={white_1}/>
        </svg>
    );
};

export default Microphone;
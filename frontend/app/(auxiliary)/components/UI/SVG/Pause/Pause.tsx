import React, {FC} from 'react';
import {white} from "@/styles/colors";

const Pause: FC = () => {
    return (
        <svg width="19" height="19" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g clipPath="url(#clip0_2166_2368)">
                <path fillRule="evenodd" clipRule="evenodd"
                      d="M14.9286 0H12.2144C11.4652 0 10.8572 0.608 10.8572 1.35714V17.6429C10.8572 18.392 11.4652 19 12.2144 19H14.9286C15.6778 19 16.2858 18.392 16.2858 17.6429V1.35714C16.2858 0.608 15.6778 0 14.9286 0ZM6.78578 0H4.0715C3.32236 0 2.71436 0.608 2.71436 1.35714V17.6429C2.71436 18.392 3.32236 19 4.0715 19H6.78578C7.53493 19 8.14293 18.392 8.14293 17.6429V1.35714C8.14293 0.608 7.53493 0 6.78578 0Z"
                      fill={white}/>
            </g>
        </svg>

    );
};

export default Pause;
import React from 'react';
import {black} from "@/styles/colors";

const DeleteFile = () => {
    return (
        <svg width="10" height="9" viewBox="0 0 10 9" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1.51074 1L8.51074 8" stroke={black} strokeWidth="1.5" strokeLinecap="round"/>
            <path d="M8.51074 1L1.51074 8" stroke={black} strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
    );
};

export default DeleteFile;
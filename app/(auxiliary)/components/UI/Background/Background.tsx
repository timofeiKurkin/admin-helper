"use client"

import { useAppSelector } from "@/app/(auxiliary)/libs/redux-toolkit/store/hooks";
import {
    selectServerResponse
} from "@/app/(auxiliary)/libs/redux-toolkit/store/slices/UserFormDataSlice/UserFormDataSlice";
import backgroundStyles from "@/styles/variables.module.scss";
import { FC } from 'react';

const Background: FC = () => {
    const serverResponse = useAppSelector(selectServerResponse)
    const backgroundStatus = serverResponse.sentToServer && (serverResponse.status === "success" ? backgroundStyles.background_success : backgroundStyles.background_error)

    return (
        <div className={`${backgroundStyles.background} ${backgroundStatus}`}></div>
    );
};

export default Background;
"use client"

import React, { FC } from 'react';
import { ChildrenProp } from "@/app/(auxiliary)/types/AppTypes/AppTypes";
import backgroundStyles from "@/styles/variables.module.scss";
import { useAppSelector } from "@/app/(auxiliary)/libs/redux-toolkit/store/hooks";
import {
    selectServerResponse
} from "@/app/(auxiliary)/libs/redux-toolkit/store/slices/UserFormDataSlice/UserFormDataSlice";

const Background: FC = () => {
    const serverResponse = useAppSelector(selectServerResponse)
    const backgroundStatus = serverResponse.sentToServer && (serverResponse.status === "success" ? backgroundStyles.background_success : backgroundStyles.background_error)

    return (
        <div className={`${backgroundStyles.background} ${backgroundStatus}`}></div>
    );
};

export default Background;
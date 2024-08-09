"use client"

import React, {FC, useContext, useEffect, useState} from 'react';
import {AppContext} from "@/app/(auxiliary)/components/Common/Provider/Provider";
import Button from "@/app/(auxiliary)/components/UI/Button/Button";
import {DeviceType, SavedInputsDataType} from "@/app/(auxiliary)/types/AppTypes/InputHooksTypes";
import {ProviderStateType, UserFormDataType} from "@/app/(auxiliary)/types/AppTypes/Context";
import {axiosRequestsHandler} from "@/app/(auxiliary)/func/axiosRequestsHandler";
import HelpUserService from "@/app/(auxiliary)/libs/axios/services/HelpUserService/HelpUserService";


const validationHandler = (args: {
    appState: ProviderStateType
}) => {
    if (args.appState.userFormData?.textData && args.appState.userFormData.fileData) {
        const textDataKeys = Object.keys(args.appState.userFormData?.textData)

        return (textDataKeys as (DeviceType | SavedInputsDataType)[]).every((key) => (
            args.appState.userFormData?.textData ?
                !!args.appState.userFormData?.textData[key]?.validationStatus :
                false
        ))
    }

    return false
}


interface PropsType {
    buttonText: string;
}

const FormUserDataUpload: FC<PropsType> = ({
                                               buttonText
                                           }) => {
    const {appState} = useContext(AppContext)

    const [finallyValidationStatus, setFinallyValidationStatus] =
        useState<boolean>(() => validationHandler({appState}))

    useEffect(() => {
        setFinallyValidationStatus(() => validationHandler({appState}))
    }, [appState]);

    const uploadUserData = async (data: UserFormDataType | undefined) => {
        if (data) {
            const response = await axiosRequestsHandler(HelpUserService.requestClassification(data))
        }
    }

    return (
        <Button disabled={!finallyValidationStatus || !appState.permissionAgree?.userAgreed}
                onClick={() => uploadUserData(appState.userFormData)}>
            {buttonText}
        </Button>
    );
};

export default FormUserDataUpload;
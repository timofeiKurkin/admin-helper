"use client"

import React, {FC, useContext, useEffect, useState} from 'react';
import {AppContext} from "@/app/(auxiliary)/components/Common/Provider/Provider";
import Button from "@/app/(auxiliary)/components/UI/Button/Button";
import {
    DeviceType,
    PhotoAndVideoInputType,
    SavedInputsDataType
} from "@/app/(auxiliary)/types/AppTypes/InputHooksTypes";
import {
    KEYS_OF_USER_FORM_DATA,
    ProviderStateType,
    UserDataForSendToServerType,
    UserFormDataType
} from "@/app/(auxiliary)/types/AppTypes/Context";
import {axiosRequestsHandler} from "@/app/(auxiliary)/func/axiosRequestsHandler";
import HelpUserService from "@/app/(auxiliary)/libs/axios/services/HelpUserService/HelpUserService";


const validationHandler = (args: {
    appState: ProviderStateType
}) => {
    if (args.appState.userFormData?.text_data && args.appState.userFormData.file_data) {
        const textDataKeys = Object.keys(args.appState.userFormData?.text_data)

        return (textDataKeys as (DeviceType | SavedInputsDataType)[]).every((key) => (
            args.appState.userFormData?.text_data ?
                !!args.appState.userFormData?.text_data[key]?.validationStatus :
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
            // I should create a new object for send to the server. Data from appState.userFormData put into the FormData object.

            let formData = new FormData()
            formData.append("keys", JSON.stringify(KEYS_OF_USER_FORM_DATA))
            formData.append("text_data", "")

            const filesData =
                data.file_data && (Object.keys(data.file_data) as PhotoAndVideoInputType[]).map((key) => (
                    data.file_data && data.file_data[key]
                )).filter(Boolean)

            if (filesData && filesData.length) {
                filesData.forEach((item) => {
                    if (item) {
                        item.files.forEach((file) => formData.append(item.type, file))
                    }
                })
            }

            // formData.append("file_data", "")

            console.log("formData", formData)

            const dataForSend: UserDataForSendToServerType = {
                keys: KEYS_OF_USER_FORM_DATA,
                data: data
            }
            // console.log("dataForSend: ", dataForSend)

            // const response =
            //     await axiosRequestsHandler(HelpUserService.requestClassification(dataForSend))
            // console.log("response: ", response)
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
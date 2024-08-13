"use client"

import React, {FC, useContext, useEffect, useState} from 'react';
import {AppContext} from "@/app/(auxiliary)/components/Common/Provider/Provider";
import Button from "@/app/(auxiliary)/components/UI/Button/Button";
import {
    DeviceType, MESSAGE_KEY,
    PhotoAndVideoType,
    SavedInputsDataType, TypeOfInputs
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

    const updateObject = (key: TypeOfInputs, object: any) => {
        return {
            [key]: {
                ...object,
                type: key
            }
        }
    }

    const uploadUserData = async (userData: UserFormDataType | undefined) => {
        if (
            userData &&
            (userData.text_data && userData.file_data)
        ) {
            let formData = new FormData()

            if (userData.text_data[MESSAGE_KEY]?.validationStatus) {
                const currentMessage = userData.text_data[MESSAGE_KEY]?.value

                if (currentMessage instanceof File) {
                    formData.append(`${MESSAGE_KEY}_file`, currentMessage)
                } else if (typeof currentMessage === "string") {
                    formData.append(`${MESSAGE_KEY}_text`, currentMessage)
                }
                delete userData.text_data[MESSAGE_KEY]
            }

            if (userData.text_data) {
                (Object.keys(userData.text_data) as (DeviceType | SavedInputsDataType)[]).forEach((key) => {
                    if (userData.text_data && userData.text_data[key]) {
                        if (userData.text_data[key].validationStatus) {
                            formData.append(key, userData.text_data[key]?.value)
                        }
                    }
                })
            }

            if (userData.file_data) {
                (Object.keys(userData.file_data) as PhotoAndVideoType[]).forEach((key) => {
                    if (userData.file_data && userData.file_data[key]) {
                        userData.file_data[key]?.files.forEach((file) => formData.append(key, file))
                    }
                })
            }

            // formData.forEach((value, key) => {
            //     console.log("");
            //     console.log("key: ", key);
            //     console.log("value: ", value);
            // });

            const response =
                await axiosRequestsHandler(HelpUserService.requestClassification(formData))
            console.log("response: ", response)
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
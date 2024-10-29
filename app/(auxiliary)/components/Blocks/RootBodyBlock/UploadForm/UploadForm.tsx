"use client"

import React, { FC, useEffect, useState } from 'react';
import Button from "@/app/(auxiliary)/components/UI/Button/Button";
import {
    DeviceKeyType,
    MESSAGE_KEY,
    PhotoAndVideoKeysType,
    SavedInputsKeysType,
    VIDEO_KEY
} from "@/app/(auxiliary)/types/AppTypes/InputHooksTypes";
import { UserFormDataType } from "@/app/(auxiliary)/types/AppTypes/Context";
import { axiosRequestsHandler } from "@/app/(auxiliary)/func/axiosRequestsHandler";
import HelpUserService from "@/app/(auxiliary)/libs/axios/services/HelpUserService/HelpUserService";
import { useAppDispatch, useAppSelector } from "@/app/(auxiliary)/libs/redux-toolkit/store/hooks";
import {
    selectFormFileData,
    selectFormTextData,
    selectPermissionsOfForm,
    selectUserMessageStatus,
    selectValidationFormStatus,
    setFormToDefault,
    setServerResponse,
    setValidationFormStatus
} from "@/app/(auxiliary)/libs/redux-toolkit/store/slices/UserFormDataSlice/UserFormDataSlice";
import { AxiosResponse } from "axios";
import { ResponseFromServerType } from "@/app/(auxiliary)/types/AxiosTypes/AxiosTypes";
import { setDisableFormInputs, setNewNotification } from '@/app/(auxiliary)/libs/redux-toolkit/store/slices/AppSlice/AppSlice';
import { setUserAuthorization } from '@/app/(auxiliary)/libs/redux-toolkit/store/slices/UserRequestsSlice/UserRequestsSlice';

// const validationHandler = (args: {
//     appState: ProviderStateType
// }) => {
//     if (args.appState.userFormData?.text_data && args.appState.userFormData.file_data) {
//         const textDataKeys = Object.keys(args.appState.userFormData?.text_data)
//
//         return (textDataKeys as (DeviceKeyType | SavedInputsKeysTypes)[]).every((key) => (
//             args.appState.userFormData?.text_data ?
//                 !!args.appState.userFormData?.text_data[key]?.validationStatus :
//                 false
//         ))
//     }
//
//     return false
// }


interface PropsType {
    buttonText: string;
}

const UploadForm: FC<PropsType> = ({ buttonText }) => {
    const dispatch = useAppDispatch()
    const formTextData = useAppSelector(selectFormTextData)
    const formFileData = useAppSelector(selectFormFileData)
    const permissionsOfForm = useAppSelector(selectPermissionsOfForm)
    const validationFormStatus = useAppSelector(selectValidationFormStatus)

    const userMessageStatus = useAppSelector(selectUserMessageStatus)

    const [sendingRequest, setSendingRequest] = useState<boolean>(false)

    useEffect(() => {
        dispatch(setValidationFormStatus())
    }, [
        dispatch,
        formTextData,
        formFileData
    ]);

    const uploadUserData = async (userData: UserFormDataType) => {
        if (
            userData &&
            (userData.text_data && userData.file_data)
        ) {
            setSendingRequest(true)
            dispatch(setDisableFormInputs())

            try {
                let formData = new FormData()
                formData.append("userCanTalk", String(permissionsOfForm.userCanTalk))
                formData.append("userAgreed", String(permissionsOfForm.userAgreed))

                if (userData.text_data) {
                    (Object.keys(userData.text_data) as (DeviceKeyType | SavedInputsKeysType)[]).forEach((key) => {
                        if (key !== "message") {
                            if (userData.text_data[key].validationStatus) {
                                formData.append(key, userData.text_data[key]?.value)
                            }
                        } else if (userMessageStatus) {
                            formData.append(`${MESSAGE_KEY}_text`, userData.text_data[MESSAGE_KEY].value)
                        }
                    })
                }

                if (userData.file_data) {
                    (Object.keys(userData.file_data) as (PhotoAndVideoKeysType | typeof MESSAGE_KEY)[]).forEach((key) => {
                        if (key !== "message") {
                            if (key === VIDEO_KEY) {
                                userData.file_data[key]?.files.forEach((file) => formData.append(key, file))
                            } else {
                                userData.file_data[key]?.filesFinally.forEach((file) => formData.append(key, file))
                            }
                        } else if (!userMessageStatus) {
                            formData.append(`${MESSAGE_KEY}_file`, userData.file_data[MESSAGE_KEY].value)
                        }
                    })
                }

                const response =
                    await axiosRequestsHandler(HelpUserService.requestClassification(formData))

                if ((response as AxiosResponse<ResponseFromServerType>).status === 201) {
                    const succeedResponse = (response as AxiosResponse<ResponseFromServerType>)
                    dispatch(setUserAuthorization(true))
                    dispatch(setFormToDefault())
                    dispatch(setNewNotification({
                        message: succeedResponse.data.message,
                        type: "success",
                        timeout: 10000
                    }))
                    dispatch(setServerResponse({
                        status: "success",
                        sentToServer: true,
                        message: succeedResponse.data.message
                    }))
                } else {
                    const message = "Произошла ошибка при отправке формы! Обновите страницу и попробуйте еще раз!"
                    dispatch(setServerResponse({
                        status: "error",
                        sentToServer: true,
                        message
                    }))
                    dispatch(setNewNotification({
                        message,
                        type: "error",
                        timeout: 10000
                    }))
                }
            } finally {
                setSendingRequest((prevState) => !prevState)
                dispatch(setDisableFormInputs())
            }

        }
    }

    // TODO: Form blocking during sending request

    return (
        <Button disabled={sendingRequest || (!validationFormStatus || !permissionsOfForm.userAgreed)}
            loadingAnimation={sendingRequest}
            onClick={() => uploadUserData({
                text_data: formTextData,
                file_data: formFileData
            })}>
            {sendingRequest ? "Создание заявки" : buttonText}
        </Button>
    );
};

export default UploadForm;
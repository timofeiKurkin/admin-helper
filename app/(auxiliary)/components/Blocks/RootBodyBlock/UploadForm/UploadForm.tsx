"use client"

import Button from "@/app/(auxiliary)/components/UI/Button/Button";
import { axiosRequestsHandler } from "@/app/(auxiliary)/func/axiosRequestsHandler";
import { boldSpanTag } from "@/app/(auxiliary)/func/tags/boldSpanTag";
import { validateCompanyData, validateFormInputs } from "@/app/(auxiliary)/func/validateFormInputs";
import HelpUserService from "@/app/(auxiliary)/libs/axios/services/HelpUserService/HelpUserService";
import { useAppDispatch, useAppSelector } from "@/app/(auxiliary)/libs/redux-toolkit/store/hooks";
import { setDisableFormInputs, setNewNotification } from '@/app/(auxiliary)/libs/redux-toolkit/store/slices/AppSlice/AppSlice';
import {
    resetFormToDefault,
    selectCompanyInputDataType,
    selectFormFileData,
    selectFormTextData,
    selectMessageInputDataType,
    selectPermissionsOfForm,
    setRejectionInputs,
    setServerResponse,
} from "@/app/(auxiliary)/libs/redux-toolkit/store/slices/UserFormDataSlice/UserFormDataSlice";
import { setUserAuthorization } from '@/app/(auxiliary)/libs/redux-toolkit/store/slices/UserRequestsSlice/UserRequestsSlice';
import { UserFormDataType } from "@/app/(auxiliary)/types/AppTypes/ContextTypes";
import {
    COMPANY_KEY,
    DEVICE_KEY,
    MESSAGE_KEY,
    NAME_KEY,
    NUMBER_PC_KEY,
    PHONE_KEY,
    PHOTO_KEY,
    PhotoAndVideoKeysType,
    TextInputsKeysType,
    USER_CAN_TALK,
    USER_POLITICAL,
    VIDEO_KEY
} from "@/app/(auxiliary)/types/AppTypes/InputHooksTypes";
import { ResponseFromServerType } from "@/app/(auxiliary)/types/AxiosTypes/AxiosTypes";
import { AxiosResponse } from "axios";
import { FC, useState } from 'react';


interface PropsType {
    buttonText: string;
}

const UploadForm: FC<PropsType> = ({ buttonText }) => {
    const dispatch = useAppDispatch()
    const formTextData = useAppSelector(selectFormTextData)
    const formFileData = useAppSelector(selectFormFileData)
    const permissionsOfForm = useAppSelector(selectPermissionsOfForm)

    // const userMessageStatus = useAppSelector(selectUserMessageStatus)
    const messageInputDataType = useAppSelector(selectMessageInputDataType)
    const companyInputDataType = useAppSelector(selectCompanyInputDataType)

    const [sendingRequest, setSendingRequest] = useState<boolean>(false)

    const uploadUserData = async (userData: UserFormDataType) => {
        /**
         * Validate all form's inputs
         */
        const validateData = validateFormInputs(
            formTextData,
            formFileData[MESSAGE_KEY],
            permissionsOfForm,
            messageInputDataType
        )

        if (validateData.status) {
            const validateCompany = validateCompanyData(userData.text_data[COMPANY_KEY].value, companyInputDataType)

            if (validateCompany) {
                setSendingRequest(true)
                dispatch(setDisableFormInputs())

                try {
                    let formData = new FormData()
                    formData.append(USER_CAN_TALK, String(permissionsOfForm.userCanTalk))
                    formData.append(USER_POLITICAL, String(permissionsOfForm.userAgreedPolitical))

                    if (messageInputDataType === "text") {
                        formData.append(`${MESSAGE_KEY}_text`, userData.text_data[MESSAGE_KEY].value)
                    } else {
                        formData.append(`${MESSAGE_KEY}_file`, userData.file_data[MESSAGE_KEY].value)
                    }

                    formData.append(DEVICE_KEY, userData.text_data[DEVICE_KEY].value)
                    formData.append(NAME_KEY, userData.text_data[NAME_KEY].value)
                    formData.append(COMPANY_KEY, userData.text_data[COMPANY_KEY].value)
                    formData.append(PHONE_KEY, userData.text_data[PHONE_KEY].value)
                    formData.append(NUMBER_PC_KEY, userData.text_data[NUMBER_PC_KEY].value)

                    if (userData.file_data[PHOTO_KEY].files.length) {
                        userData.file_data[PHOTO_KEY].filesFinally.forEach((photo) => {
                            formData.append(PHOTO_KEY, photo)
                        })
                    }

                    if (userData.file_data[VIDEO_KEY].files.length) {
                        userData.file_data[VIDEO_KEY].files.forEach((photo) => {
                            formData.append(VIDEO_KEY, photo)
                        })
                    }

                    const response =
                        await axiosRequestsHandler(HelpUserService.requestClassification(formData))

                    if ((response as AxiosResponse<ResponseFromServerType>).status === 201) {
                        const succeedResponse = (response as AxiosResponse<ResponseFromServerType>)
                        dispatch(resetFormToDefault())
                        dispatch(setUserAuthorization(true))
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
            } else {
                const message = `Выберите свою организацию из ${boldSpanTag("выпадающего списка")} или ${boldSpanTag("введите другую")}`
                dispatch(setNewNotification({ message, type: "warning" }))
                dispatch(setRejectionInputs([COMPANY_KEY]))
            }
        } else {
            dispatch(setRejectionInputs(validateData.keys))
        }
    }

    // TODO: Form blocking during sending request

    return (
        <Button loadingAnimation={sendingRequest}
            onClick={() => uploadUserData({
                text_data: formTextData,
                file_data: formFileData
            })}>
            {sendingRequest ? "Создание заявки" : buttonText}
        </Button>
    );
};

export default UploadForm;
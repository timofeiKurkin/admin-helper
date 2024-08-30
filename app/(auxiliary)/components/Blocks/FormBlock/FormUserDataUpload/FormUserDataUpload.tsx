"use client"

import React, {FC, useEffect} from 'react';
import Button from "@/app/(auxiliary)/components/UI/Button/Button";
import {
    DeviceKeyType,
    MESSAGE_KEY,
    PhotoAndVideoKeysTypes,
    SavedInputsKeysTypes
} from "@/app/(auxiliary)/types/AppTypes/InputHooksTypes";
import {UserFormDataType} from "@/app/(auxiliary)/types/AppTypes/Context";
import {axiosRequestsHandler} from "@/app/(auxiliary)/func/axiosRequestsHandler";
import HelpUserService from "@/app/(auxiliary)/libs/axios/services/HelpUserService/HelpUserService";
import {useAppDispatch, useAppSelector} from "@/app/(auxiliary)/libs/redux-toolkit/store/hooks";
import {
    selectFormFileData,
    selectFormTextData,
    selectPermissionsOfForm,
    selectValidationFormStatus,
    setValidationFormStatus
} from "@/app/(auxiliary)/libs/redux-toolkit/store/slices/UserFormDataSlice/UserFormDataSlice";


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

const FormUserDataUpload: FC<PropsType> = ({buttonText}) => {
    const dispatch = useAppDispatch()
    const formTextData = useAppSelector(selectFormTextData)
    const formFileData = useAppSelector(selectFormFileData)
    const permissionsOfForm = useAppSelector(selectPermissionsOfForm)
    const validationFormStatus = useAppSelector(selectValidationFormStatus)

    useEffect(() => {
        dispatch(setValidationFormStatus())
    }, [
        dispatch
    ]);

    const uploadUserData = async (userData: UserFormDataType) => {
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
                // delete userData.text_data[MESSAGE_KEY]
            }

            if (userData.text_data) {
                (Object.keys(userData.text_data) as (DeviceKeyType | SavedInputsKeysTypes)[]).forEach((key) => {
                    if (key !== "message" && userData.text_data && userData.text_data[key]) {
                        if (userData.text_data[key].validationStatus) {
                            formData.append(key, userData.text_data[key]?.value)
                        }
                    }
                })
            }

            if (userData.file_data) {
                (Object.keys(userData.file_data) as PhotoAndVideoKeysTypes[]).forEach((key) => {
                    if (userData.file_data && userData.file_data[key]) {
                        userData.file_data[key]?.files.forEach((file) => formData.append(key, file.url))
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
        <Button disabled={!validationFormStatus || !permissionsOfForm.userAgreed}
                onClick={() => uploadUserData({
                    text_data: formTextData,
                    file_data: formFileData
                })}>
            {buttonText}
        </Button>
    );
};

export default FormUserDataUpload;
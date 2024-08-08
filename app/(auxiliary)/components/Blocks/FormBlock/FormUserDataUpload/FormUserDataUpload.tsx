"use client"

import React, {FC, useContext, useEffect, useState} from 'react';
import {AppContext} from "@/app/(auxiliary)/components/Common/Provider/Provider";
import Button from "@/app/(auxiliary)/components/UI/Button/Button";
import {DeviceType, SavedInputsDataType} from "@/app/(auxiliary)/types/AppTypes/InputHooksTypes";
import {ProviderStateType} from "@/app/(auxiliary)/types/AppTypes/Context";


const validationHandler = (args: {
    appState: ProviderStateType
}) => {
    if (args.appState.userDataFromForm?.textData && args.appState.userDataFromForm.fileData) {
        const textDataKeys = Object.keys(args.appState.userDataFromForm?.textData)

        return (textDataKeys as (DeviceType | SavedInputsDataType)[]).every((key) => (
            args.appState.userDataFromForm?.textData ?
                !!args.appState.userDataFromForm?.textData[key]?.validationStatus :
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

    const uploadUserData = async () => {

    }

    return (
        <Button disabled={!finallyValidationStatus || !appState.permissionAgree?.userAgreed}
                onClick={uploadUserData}>
            {buttonText}
        </Button>
    );
};

export default FormUserDataUpload;
import React, { FC, Suspense, useEffect, useState } from 'react';
import {
    CompanyInputType,
    DeviceInputType,
    InputHelpfulItemType,
    NameInputType
} from "@/app/(auxiliary)/types/Data/Interface/RootPage/RootPageContentType";
import useInput from "@/app/(auxiliary)/hooks/useInput";
import {
    inputValidations
} from "@/app/(auxiliary)/components/Blocks/FormBlock/CoupleOfInputs/CurrentInput/inputValidations";
import Input from "@/app/(auxiliary)/components/UI/Inputs/Input/Input";
import inputsStyles from "../InputsStyles.module.scss"
import InputWithDataList from "@/app/(auxiliary)/components/UI/Inputs/InputWithDataList/InputWithDataList";
import { useAppDispatch, useAppSelector } from "@/app/(auxiliary)/libs/redux-toolkit/store/hooks";
import {
    changeTextData,
    selectServerResponse
} from "@/app/(auxiliary)/libs/redux-toolkit/store/slices/UserFormDataSlice/UserFormDataSlice";
import {
    AllKeysOfInputsType,
    COMPANY_KEY,
    DEVICE_KEY,
    TextInputsKeysType
} from "@/app/(auxiliary)/types/AppTypes/InputHooksTypes";
import dynamic from 'next/dynamic';
import InputLoadingSkeleton from '@/app/(auxiliary)/components/UI/Loaders/InputLoadingSkeleton/InputLoadingSkeleton';


const typeOfInputsClasses: { [key: string]: string } = {
    "device": inputsStyles.deviceInputWrapper,
    "name": inputsStyles.nameInputWrapper,
    "number-pc": inputsStyles.numberPCInputWrapper,
    "company": inputsStyles.companyInputWrapper
}

interface PropsType {
    currentInput: DeviceInputType | CompanyInputType | NameInputType;
}

const LazyInput = dynamic(
    () => import("@/app/(auxiliary)/components/UI/Inputs/Input/Input"),
    {
        ssr: false,
        loading: () => <InputLoadingSkeleton />
    }
)

const TextInput: FC<PropsType> = ({
    currentInput
}) => {
    const dispatch = useAppDispatch()
    const serverResponse = useAppSelector(selectServerResponse).status
    const value =
        useInput("", currentInput.type as AllKeysOfInputsType, inputValidations[currentInput.type])
    const [currentHelpfulList, setCurrentHelpfulList] =
        useState<InputHelpfulItemType[]>(() => {
            if (currentInput.type === DEVICE_KEY || currentInput.type === COMPANY_KEY) {
                return (currentInput as CompanyInputType | DeviceInputType).helpfulList
            }
            return []
        })

    const currentInputTypesClassName = typeOfInputsClasses[currentInput.type]

    // useEffect(() => {
    //     if (currentInput.type === DEVICE_KEY || currentInput.type === COMPANY_KEY) {
    //         const devicesList = (currentInput as CompanyInputType | DeviceInputType).helpfulList
    //         setCurrentHelpfulList((prevState) => devicesList || prevState)
    //     }
    // }, [currentInput]);

    useEffect(() => {
        dispatch(changeTextData({
            key: currentInput.type as TextInputsKeysType,
            data: {
                validationStatus: value.inputValid,
                value: value.value
            }
        }))
    }, [
        dispatch,
        value.value,
        value.inputValid,
        currentInput.type
    ]);

    useEffect(() => {
        if (serverResponse === "success") {
            value.resetValue()
        }
    }, [
        serverResponse,
        value
    ]);

    return Object.keys(value).length ? (
        <InputWithDataList value={value.value}
            dataList={currentHelpfulList.length ? {
                list: currentHelpfulList,
                listType: currentInput.type
            } : undefined}
            inputIsDirty={value.isDirty}>
            <div className={currentInputTypesClassName}>
                <LazyInput value={value.value}
                    placeholder={currentInput.inputPlaceholder || ""}
                    maxLength={inputValidations[currentInput.type].maxLength}
                    tabIndex={currentInput.id}
                    onBlur={value.onBlur}
                    onChange={value.onChange}
                    inputIsDirty={value.isDirty} />
            </div>
        </InputWithDataList>
    ) : null
};

export default TextInput;
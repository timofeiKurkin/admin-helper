import React, {FC, useEffect, useState} from 'react';
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
import {useAppDispatch} from "@/app/(auxiliary)/libs/redux-toolkit/store/hooks";
import {changeTextData} from "@/app/(auxiliary)/libs/redux-toolkit/store/slices/UserFormDataSlice/UserFormDataSlice";
import {COMPANY_KEY, DEVICE_KEY} from "@/app/(auxiliary)/types/AppTypes/InputHooksTypes";


const typeOfInputsClasses: { [key: string]: string } = {
    "device": inputsStyles.deviceInputWrapper,
    "name": inputsStyles.nameInputWrapper,
    "number-pc": inputsStyles.numberPCInputWrapper,
    "company": inputsStyles.companyInputWrapper
}

interface PropsType {
    currentInput: DeviceInputType | CompanyInputType | NameInputType;
}

const TextInput: FC<PropsType> = ({
                                      currentInput
                                  }) => {
    const dispatch = useAppDispatch()
    const value =
        useInput("", currentInput.type, inputValidations[currentInput.type])
    const [currentHelpfulList, setCurrentHelpfulList] =
        useState<InputHelpfulItemType[]>([])

    const currentInputTypesClassName = typeOfInputsClasses[currentInput.type]

    useEffect(() => {
        if (currentInput.type === DEVICE_KEY || currentInput.type === COMPANY_KEY) {
            const devicesList = (currentInput as CompanyInputType | DeviceInputType).helpfulList
            setCurrentHelpfulList((prevState) => devicesList || prevState)
        }
    }, [currentInput]);

    useEffect(() => {
        dispatch(changeTextData({
            key: currentInput.type,
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

    return (
        <>
            <InputWithDataList value={value.value}
                               dataList={currentHelpfulList.length ? {
                                   list: currentHelpfulList,
                                   listType: currentInput.type
                               } : undefined} inputIsDirty={value.isDirty}>
                <div className={currentInputTypesClassName}>
                    <Input value={value.value}
                           placeholder={currentInput.inputPlaceholder || ""}
                           maxLength={inputValidations[currentInput.type].maxLength}
                           tabIndex={currentInput.id}
                           onBlur={value.onBlur}
                           onChange={value.onChange}
                           inputIsDirty={value.isDirty}/>

                </div>
            </InputWithDataList>
        </>
    )
};

export default TextInput;
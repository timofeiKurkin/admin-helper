import React, {Dispatch, FC, SetStateAction, useContext, useEffect, useState} from 'react';
import {
    CompanyInputType,
    DeviceInputType, InputHelpfulItemType,
    NameInputType
} from "@/app/(auxiliary)/types/Data/Interface/RootPage/RootPageType";
import useInput from "@/app/(auxiliary)/hooks/useInput";
import {
    inputValidations
} from "@/app/(auxiliary)/components/Blocks/FormBlock/CoupleOfInputs/CurrentInput/inputValidations";
import Input from "@/app/(auxiliary)/components/UI/Inputs/Input/Input";
import inputsStyles from "../InputsStyles.module.scss"
import InputWithDataList from "@/app/(auxiliary)/components/UI/Inputs/InputWithDataList/InputWithDataList";
import {AppContext} from "@/app/(auxiliary)/components/Common/Provider/Provider";
import {ProviderStateType} from "@/app/(auxiliary)/types/AppTypes/Context";
import {updateFormsDataState} from "@/app/(auxiliary)/func/updateFormsDataState";


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
    const {appState, setAppState} = useContext(AppContext)
    const value =
        useInput("", currentInput.type, inputValidations[currentInput.type])
    const [currentHelpfulList, setCurrentHelpfulList] =
        useState<InputHelpfulItemType[]>([])

    const currentInputTypesClassName = typeOfInputsClasses[currentInput.type]

    useEffect(() => {
        if (currentInput.type === "device" || currentInput.type === "company") {
            const devicesList = (currentInput as CompanyInputType | DeviceInputType).helpfulList
            setCurrentHelpfulList((prevState) => devicesList || prevState)
        }
    }, [currentInput]);

    useEffect(() => {
        updateFormsDataState<string>({
            setAppState,
            newValue: {
                validationStatus: value.inputValid,
                value: value.value
            },
            key: currentInput.type
        })

    }, [
        setAppState,
        appState,
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
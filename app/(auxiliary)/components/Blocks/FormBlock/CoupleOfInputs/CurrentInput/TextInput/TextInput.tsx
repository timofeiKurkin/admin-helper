import {
    inputValidations
} from "@/app/(auxiliary)/components/Blocks/FormBlock/CoupleOfInputs/CurrentInput/inputValidations";
import InputErrorLayout from '@/app/(auxiliary)/components/UI/Inputs/InputErrorLayout/InputErrorLayout';
import InputWithDataList from "@/app/(auxiliary)/components/UI/Inputs/InputWithDataList/InputWithDataList";
import useInput from "@/app/(auxiliary)/hooks/useInput";
import { useAppDispatch, useAppSelector } from "@/app/(auxiliary)/libs/redux-toolkit/store/hooks";
import {
    changeTextData,
    deleteRejectionInput,
    selectRejectionInputs,
    selectServerResponse
} from "@/app/(auxiliary)/libs/redux-toolkit/store/slices/UserFormDataSlice/UserFormDataSlice";
import {
    AllKeysOfInputsType,
    COMPANY_KEY,
    DEVICE_KEY,
    TextInputsKeysType
} from "@/app/(auxiliary)/types/AppTypes/InputHooksTypes";
import {
    CompanyInputType,
    DeviceInputType,
    InputHelpfulItemType,
    NameInputType
} from "@/app/(auxiliary)/types/Data/Interface/RootPage/RootPageContentType";
import { FC, useEffect, useState } from 'react';
import inputsStyles from "../InputsStyles.module.scss";
import { InputChangeEventHandler } from "@/app/(auxiliary)/types/AppTypes/AppTypes";


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
    const serverResponse = useAppSelector(selectServerResponse).status
    const rejectionInputs = useAppSelector(selectRejectionInputs)

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

    const onChangeHandler = (e: InputChangeEventHandler) => {
        if (rejectionInputs.includes(currentInput.type as TextInputsKeysType)) {
            dispatch(deleteRejectionInput(currentInput.type as TextInputsKeysType))
        }
        value.onChange(e)
    }

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
                <InputErrorLayout input={{
                    value: value.value,
                    placeholder: currentInput.inputPlaceholder!,
                    maxLength: inputValidations[currentInput.type].maxLength,
                    tabIndex: currentInput.id,
                    onBlur: value.onBlur,
                    onChange: onChangeHandler,
                    inputIsDirty: value.isDirty
                }} layout={{
                    value,
                    inputType: currentInput.type as TextInputsKeysType
                }} />
            </div>
        </InputWithDataList>
    ) : null
};

export default TextInput;
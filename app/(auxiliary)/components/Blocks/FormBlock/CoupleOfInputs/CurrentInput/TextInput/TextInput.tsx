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
import dynamic from "next/dynamic";
import InputLoadingSkeleton from "@/app/(auxiliary)/components/UI/Loaders/InputLoadingSkeleton/InputLoadingSkeleton";


const typeOfInputsClasses: { [key: string]: string } = {
    "device": inputsStyles.deviceInputWrapper,
    "name": inputsStyles.nameInputWrapper,
    "number-pc": inputsStyles.numberPCInputWrapper,
    "company": inputsStyles.companyInputWrapper
}

const LazyInput = dynamic(
    () => import("@/app/(auxiliary)/components/UI/Inputs/Input/Input"),
    {
        ssr: false,
        loading: () => <InputLoadingSkeleton />
    }
)

interface PropsType {
    currentInput: DeviceInputType | CompanyInputType | NameInputType;
}

const TextInput: FC<PropsType> = ({
    currentInput
}) => {
    const dispatch = useAppDispatch()
    const serverResponse = useAppSelector(selectServerResponse).status
    const rejectionInputs = useAppSelector(selectRejectionInputs)
    const [isError, setIsError] = useState<boolean>(false)
    const setErrorHandler = (status: boolean) => setIsError(status)

    const value =
        useInput("", currentInput.type, inputValidations[currentInput.type])
    const [currentHelpfulList, setCurrentHelpfulList] =
        useState<InputHelpfulItemType[]>(() => {
            if (currentInput.type === DEVICE_KEY || currentInput.type === COMPANY_KEY) {
                return (currentInput as CompanyInputType | DeviceInputType).helpfulList
            }
            return []
        })

    const currentInputTypesClassName = typeOfInputsClasses[currentInput.type]

    const onChangeHandler = (e: InputChangeEventHandler) => {
        if (isError && rejectionInputs.includes(currentInput.type as TextInputsKeysType)) {
            dispatch(deleteRejectionInput(currentInput.type as TextInputsKeysType))
            setErrorHandler(false)
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

    const changeValueHandler = (newValue: string) => {
        onChangeHandler({ target: { value: newValue } } as InputChangeEventHandler)
    }

    return (
        <InputWithDataList value={value.value}
            dataList={currentHelpfulList}
            inputIsDirty={value.isDirty}
            type={currentInput.type === "company" ? "chooseOrWrite" : "helpful"}
            changeValueHandler={changeValueHandler}>
            <div className={currentInputTypesClassName}>
                <InputErrorLayout value={value} type={currentInput.type} setIsError={setErrorHandler} isError={isError}>
                    <LazyInput value={value.value}
                        placeholder={currentInput.inputPlaceholder!}
                        maxLength={inputValidations[currentInput.type].maxLength}
                        tabIndex={currentInput.id}
                        onBlur={value.onBlur}
                        onChange={onChangeHandler}
                        inputIsDirty={value.isDirty}
                        isError={isError}
                    />
                </InputErrorLayout>
            </div>
        </InputWithDataList>
    )
};

export default TextInput;
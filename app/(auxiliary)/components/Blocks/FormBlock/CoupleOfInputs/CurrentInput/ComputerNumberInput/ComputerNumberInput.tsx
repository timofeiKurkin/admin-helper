import React, { FC, useEffect, useState } from 'react';
import { InputChangeEventHandler } from "@/app/(auxiliary)/types/AppTypes/AppTypes";
import inputsStyles
    from "@/app/(auxiliary)/components/Blocks/FormBlock/CoupleOfInputs/CurrentInput/InputsStyles.module.scss"
import useInput from "@/app/(auxiliary)/hooks/useInput";
import {
    inputValidations
} from "@/app/(auxiliary)/components/Blocks/FormBlock/CoupleOfInputs/CurrentInput/inputValidations";
import Input from "@/app/(auxiliary)/components/UI/Inputs/Input/Input";
import {
    inputHandleKeyDown
} from "@/app/(auxiliary)/components/Blocks/FormBlock/CoupleOfInputs/CurrentInput/inputHandleKeyDown";
import { useAppDispatch, useAppSelector } from "@/app/(auxiliary)/libs/redux-toolkit/store/hooks";
import { changeTextData, deleteRejectionInput, selectRejectionInputs } from "@/app/(auxiliary)/libs/redux-toolkit/store/slices/UserFormDataSlice/UserFormDataSlice";
import { NUMBER_PC_KEY, TextInputsKeysType } from "@/app/(auxiliary)/types/AppTypes/InputHooksTypes";
import dynamic from 'next/dynamic';
import InputLoadingSkeleton from '@/app/(auxiliary)/components/UI/Loaders/InputLoadingSkeleton/InputLoadingSkeleton';
import { NumberPcInputType } from '@/app/(auxiliary)/types/Data/Interface/RootPage/RootPageContentType';
import InputErrorLayout from '@/app/(auxiliary)/components/UI/Inputs/InputErrorLayout/InputErrorLayout';

interface PropsType {
    currentInput: NumberPcInputType;
    // placeholder: string;
}

const LazyInput = dynamic(
    () => import("@/app/(auxiliary)/components/UI/Inputs/Input/Input"),
    {
        ssr: false,
        loading: () => <InputLoadingSkeleton />
    }
)

const ComputerNumberInput: FC<PropsType> = ({
    currentInput
}) => {
    const dispatch = useAppDispatch()
    const value = useInput("", currentInput.type, inputValidations[currentInput.type])
    const rejectionInputs = useAppSelector(selectRejectionInputs)
    const [isError, setIsError] = useState<boolean>(false)
    const setErrorHandler = (status: boolean) => setIsError(status)


    const numberPcHandler = (e: InputChangeEventHandler) => {
        if (isError && rejectionInputs.includes(currentInput.type as TextInputsKeysType)) {
            dispatch(deleteRejectionInput(currentInput.type as TextInputsKeysType))
            setErrorHandler(false)
        }

        e.target.value = e.target.value.replace(/\D/g, '')
        let computerNumber = ""

        if (e.target.value.length > 0) {
            computerNumber += e.target.value.slice(0, 3)
        }
        if (e.target.value.length >= 3) {
            computerNumber += "-" + e.target.value.slice(3, 6);
        }
        if (e.target.value.length >= 6) {
            computerNumber += "-" + e.target.value.slice(6, 9);
        }
        if (e.target.value.length > 9) {
            computerNumber += " " + e.target.value.slice(9, 10)
        }
        if (e.target.value.length > 9) {
            const regularTen = new RegExp(/(\d)(\d{3})(\d{3})(\d{3})/)
            computerNumber = e.target.value.replace(regularTen, "$1 $2-$3-$4")
        }

        e.target.value = computerNumber

        value.onChange(e)
    }

    useEffect(() => {
        dispatch(changeTextData({
            key: NUMBER_PC_KEY,
            data: {
                validationStatus: value.inputValid,
                value: value.value
            }
        }))
    }, [
        dispatch,
        value.inputValid,
        value.value
    ]);

    return (
        <div className={inputsStyles.numberPCInputWrapper}>
            <InputErrorLayout value={value} inputType={currentInput.type} setIsError={setErrorHandler} isError={isError}>
                <LazyInput value={value.value}
                    placeholder={currentInput.inputPlaceholder!}
                    maxLength={inputValidations[NUMBER_PC_KEY].maxLength}
                    tabIndex={1}
                    type={"tel"}
                    onBlur={value.onBlur}
                    onKeyDown={(e) => inputHandleKeyDown(e, value)}
                    onChange={numberPcHandler}
                    inputIsDirty={value.isDirty}
                    isError={isError}
                    dynamicWidth={true}
                />
            </InputErrorLayout>
        </div>
    );
};

export default ComputerNumberInput;
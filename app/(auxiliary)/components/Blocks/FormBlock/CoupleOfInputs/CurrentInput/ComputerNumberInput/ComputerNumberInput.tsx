import React, {FC, useEffect} from 'react';
import {InputChangeEventHandler} from "@/app/(auxiliary)/types/AppTypes/AppTypes";
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
import {useAppDispatch} from "@/app/(auxiliary)/libs/redux-toolkit/store/hooks";
import {changeTextData} from "@/app/(auxiliary)/libs/redux-toolkit/store/slices/UserFormDataSlice/UserFormDataSlice";
import {NUMBER_PC_KEY} from "@/app/(auxiliary)/types/AppTypes/InputHooksTypes";
import dynamic from 'next/dynamic';
import InputSkeleton from '@/app/(auxiliary)/components/UI/Inputs/InputSkeleton/InputSkeleton';

interface PropsType {
    // currentInput: NumberPcInputType;
    placeholder: string;
}

const LazyInput = dynamic(
    () => import("@/app/(auxiliary)/components/UI/Inputs/Input/Input"), 
    {
        ssr: false,
        loading: () => <InputSkeleton />
    }
)

const ComputerNumberInput: FC<PropsType> = ({
                                                placeholder
                                            }) => {
    const dispatch = useAppDispatch()
    const value = useInput("", NUMBER_PC_KEY, inputValidations[NUMBER_PC_KEY])

    const numberPcHandler = (e: InputChangeEventHandler) => {
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
            <LazyInput value={value.value}
                   placeholder={placeholder}
                   maxLength={inputValidations[NUMBER_PC_KEY].maxLength}
                   tabIndex={1}
                   type={"tel"}
                   onBlur={value.onBlur}
                   onKeyDown={(e) => inputHandleKeyDown(e, value)}
                   onChange={numberPcHandler}
                   inputIsDirty={value.isDirty}
                   dynamicWidth={true}
            />
        </div>
    );
};

export default ComputerNumberInput;
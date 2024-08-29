import React, {FC, useEffect} from 'react';
import {InputChangeEventHandler} from "@/app/(auxiliary)/types/AppTypes/AppTypes";
import inputsStyles
    from "@/app/(auxiliary)/components/Blocks/FormBlock/CoupleOfInputs/CurrentInput/InputsStyles.module.scss"
import {NumberPcInputType} from "@/app/(auxiliary)/types/Data/Interface/RootPage/RootPageContentType";
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

interface PropsType {
    currentInput: NumberPcInputType;
}

const ComputerNumberInput: FC<PropsType> = ({
                                                currentInput
                                            }) => {
    const dispatch = useAppDispatch()
    const value = useInput("", currentInput.type, inputValidations[currentInput.type])

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

        e.target.value = computerNumber

        value.onChange(e)
        dispatch(changeTextData({
            key: currentInput.type,
            data: {
                validationStatus: value.inputValid,
                value: value.value
            }
        }))
    }

    useEffect(() => {
        dispatch(changeTextData({
            key: currentInput.type,
            data: {
                validationStatus: value.inputValid,
                value: value.value
            }
        }))
    }, []);

    return (
        <div className={inputsStyles.numberPCInputWrapper}>
            <Input value={value.value}
                   placeholder={currentInput.inputPlaceholder || ""}
                   maxLength={inputValidations[currentInput.type].maxLength}
                   tabIndex={1}
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
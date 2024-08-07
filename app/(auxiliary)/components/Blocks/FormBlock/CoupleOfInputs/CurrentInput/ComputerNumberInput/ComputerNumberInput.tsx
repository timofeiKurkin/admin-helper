import React, {FC, useContext} from 'react';
import {InputChangeEventHandler, KeyBoardEventHandler} from "@/app/(auxiliary)/types/AppTypes/AppTypes";
import inputsStyles
    from "@/app/(auxiliary)/components/Blocks/FormBlock/CoupleOfInputs/CurrentInput/InputsStyles.module.scss"
import {NumberPcInputType} from "@/app/(auxiliary)/types/Data/Interface/RootPage/RootPageType";
import useInput from "@/app/(auxiliary)/hooks/useInput";
import {
    inputValidations
} from "@/app/(auxiliary)/components/Blocks/FormBlock/CoupleOfInputs/CurrentInput/inputValidations";
import Input from "@/app/(auxiliary)/components/UI/Inputs/Input/Input";
import {
    inputHandleKeyDown
} from "@/app/(auxiliary)/components/Blocks/FormBlock/CoupleOfInputs/CurrentInput/inputHandleKeyDown";
import {AppContext} from "@/app/(auxiliary)/components/Common/Provider/Provider";

interface PropsType {
    currentInput: NumberPcInputType;
}

const ComputerNumberInput: FC<PropsType> = ({
                                                currentInput
                                            }) => {

    const {appState, setAppState} = useContext(AppContext)
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
        setAppState({
            ...appState,
            userDataFromForm: {
                ...appState.userDataFromForm,
                textData: {
                    ...appState.userDataFromForm?.textData,
                    [currentInput.type]: e.target.value
                }
            }
        })
    }

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
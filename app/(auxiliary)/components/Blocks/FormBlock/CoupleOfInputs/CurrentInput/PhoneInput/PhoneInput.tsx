import React, {FC} from 'react';
import {InputChangeEventHandler, KeyBoardEventHandler} from "@/app/(auxiliary)/types/AppTypes/AppTypes";
import Input from "@/app/(auxiliary)/components/UI/Inputs/Input/Input";
import useInput from "@/app/(auxiliary)/hooks/useInput";
import {
    inputValidations
} from "@/app/(auxiliary)/components/Blocks/FormBlock/CoupleOfInputs/CurrentInput/inputValidations";
import inputsStyles
    from "@/app/(auxiliary)/components/Blocks/FormBlock/CoupleOfInputs/CurrentInput/InputsStyles.module.scss";
import {PhoneNumberInputType} from "@/app/(auxiliary)/types/Data/Interface/RootPage/RootPageType";
import {
    inputHandleKeyDown
} from "@/app/(auxiliary)/components/Blocks/FormBlock/CoupleOfInputs/CurrentInput/inputHandleKeyDown";


interface PropsType {
    currentInput: PhoneNumberInputType;
}

const PhoneInput: FC<PropsType> = ({currentInput}) => {
    const value = useInput("+7 ", currentInput.type, inputValidations[currentInput.type])

    const phoneRegularExpression = (e: InputChangeEventHandler) => {
        e.target.value = e.target.value.replace(/\D/g, '')
        let formattedValue = "+7 "

        if (e.target.value.length > 1) {
            formattedValue += e.target.value.slice(1, 4);
        }
        if (e.target.value.length >= 4) {
            formattedValue += ' ' + e.target.value.slice(4, 7);
        }
        if (e.target.value.length >= 7) {
            formattedValue += ' - ' + e.target.value.slice(7, 9);
        }
        if (e.target.value.length >= 9) {
            formattedValue += ' - ' + e.target.value.slice(9, 11);
        }

        e.target.value = formattedValue

        value.onChange(e)
    }

    return (
        <div className={inputsStyles.phoneNumberInputWrapper}>
            <Input
                value={(value.isDirty || value.value.length >= 4) ? value.value : ""}
                onBlur={value.onBlur}
                type={"tel"}
                placeholder={currentInput.inputPlaceholder || ""}
                tabIndex={1}
                onKeyDown={(e) => inputHandleKeyDown(e, value)}
                maxLength={inputValidations[currentInput.type].maxLength}
                inputIsDirty={value.isDirty}
                dynamicWidth={true}
                onChange={phoneRegularExpression}/>
        </div>
    );
};

export default PhoneInput;
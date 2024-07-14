import React, {FC} from 'react';
import {InputChangeEventHandler, KeyBoardEventHandler} from "@/app/(auxiliary)/types/AppTypes/AppTypes";
import Input from "@/app/(auxiliary)/components/UI/Inputs/Input/Input";
import useInput from "@/app/(auxiliary)/hooks/useInput";
import {
    inputValidations
} from "@/app/(auxiliary)/components/Blocks/FormBlock/CoupleOfInputs/CurrentInput/inputValidations";
import styles
    from "@/app/(auxiliary)/components/Blocks/FormBlock/CoupleOfInputs/CurrentInput/TextInput/TextInput.module.scss";
import {PhoneNumberInputType} from "@/app/(auxiliary)/types/Data/Interface/RootPage/RootPageType";


const typeOfInputsClasses: { [key: string]: string } = {
    "phone-number": styles.phoneNumberInputWrapper,
}

interface PropsType {
    currentInput: PhoneNumberInputType;
}

const PhoneInput: FC<PropsType> = ({currentInput}) => {
    const currentInputTypesClassName = typeOfInputsClasses["phone-number"]
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

    const handleKeyDown = (e: KeyBoardEventHandler<HTMLInputElement>) => {
        const isDigit = /\d/.test(e.key);
        const isControl = [
            'Backspace',
            'ArrowLeft',
            'ArrowRight',
            'Delete',
            'Tab',
            "Control",
            "v"
        ].includes(e.key);

        if (!isDigit && !isControl) {
            e.preventDefault();
        }

        if (e.key === 'Backspace' && !isDigit) {
            if (value.value.length >= 4 && value.value.endsWith(" - ")) {
                e.preventDefault()
                value.onChange({target: {value: value.value.slice(0, -3)}} as React.ChangeEvent<HTMLInputElement>)
            } else if (value.value.length >= 4 && (value.value.endsWith(" "))) {
                e.preventDefault()
                value.onChange({target: {value: value.value.slice(0, -1)}} as React.ChangeEvent<HTMLInputElement>)
            }
        }
    };

    return (
        <div className={currentInputTypesClassName}>
            <Input
                value={(value.isDirty || value.value.length >= 4) ? value.value : ""}
                onBlur={value.onBlur}
                type={"tel"}
                placeholder={currentInput.inputPlaceholder || ""}
                tabIndex={1}
                onKeyDown={handleKeyDown}
                maxLength={inputValidations[currentInput.type].maxLength}
                inputIsDirty={value.isDirty}
                onChange={phoneRegularExpression}/>
        </div>
    );
};

export default PhoneInput;
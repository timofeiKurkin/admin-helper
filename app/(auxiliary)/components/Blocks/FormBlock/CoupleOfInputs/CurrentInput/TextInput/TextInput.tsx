import React, {FC} from 'react';
import {AllTypesOfInputs} from "@/app/(auxiliary)/types/Data/Interface/RootPage/RootPageType";
import useInput from "@/app/(auxiliary)/hooks/useInput";
import {
    inputValidations
} from "@/app/(auxiliary)/components/Blocks/FormBlock/CoupleOfInputs/CurrentInput/inputValidations";
import Input from "@/app/(auxiliary)/components/UI/Inputs/Input/Input";
import styles from "./TextInput.module.scss";


const typeOfInputsClasses: { [key: string]: string } = {
    "device": styles.deviceInputWrapper,
    "name": styles.nameInputWrapper,
    "phone-number": styles.phoneNumberInputWrapper,
    "number-pc": styles.numberPCInputWrapper,
}

interface PropsType {
    currentInput: AllTypesOfInputs;
}

const TextInput: FC<PropsType> = ({
                                      currentInput
                                  }) => {
    const currentInputTypesClassName = typeOfInputsClasses[currentInput.type]
    const value = useInput("", currentInput.type, inputValidations[currentInput.type])

    return (
        <div className={`${styles.inputWrapper} ${currentInputTypesClassName}`}>
            <Input value={value.value}
                   placeholder={currentInput.inputPlaceholder || ""}
                   maxLength={inputValidations[currentInput.type].maxLength}
                   tabIndex={currentInput.id}
                   onBlur={value.onBlur}
                   onChange={value.onChange}
                   inputIsDirty={value.isDirty}/>
        </div>
    )
};

export default TextInput;
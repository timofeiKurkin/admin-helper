import React, {FC} from 'react';
import {AllTypesOfInputs} from "@/app/(auxiliary)/types/Data/Interface/RootPage/RootPageType";
import useInput from "@/app/(auxiliary)/hooks/useInput";
import {
    inputValidations
} from "@/app/(auxiliary)/components/Blocks/FormBlock/CoupleOfInputs/CurrentInput/inputValidations";
import generalStyles from "@/app/(auxiliary)/components/Blocks/FormBlock/CoupleOfInputs/CurrentInput/CurrentInput.module.scss";
import Input from "@/app/(auxiliary)/components/UI/Inputs/Input/Input";


interface PropsType {
    currentInput: AllTypesOfInputs;
}

const TextInput: FC<PropsType> = ({
                                      currentInput
                                  }) => {
    const value = useInput("", currentInput.type, inputValidations[currentInput.type])

    return (
        <div className={generalStyles.inputWrapper}>
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
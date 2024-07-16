import React, {FC, useEffect, useState} from 'react';
import {
    CompanyInputType,
    DeviceInputType,
    NameInputType
} from "@/app/(auxiliary)/types/Data/Interface/RootPage/RootPageType";
import useInput from "@/app/(auxiliary)/hooks/useInput";
import {
    inputValidations
} from "@/app/(auxiliary)/components/Blocks/FormBlock/CoupleOfInputs/CurrentInput/inputValidations";
import Input from "@/app/(auxiliary)/components/UI/Inputs/Input/Input";
import inputsStyles from "../InputsStyles.module.scss"


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
    const currentInputTypesClassName = typeOfInputsClasses[currentInput.type]
    const value = useInput("", currentInput.type, inputValidations[currentInput.type])
    const [currentHelpfulList, setCurrentHelpfulList] = useState<string[]>([])

    useEffect(() => {
        if(currentInput.type === "device" || currentInput.type === "company") {
            const devicesList = currentInput.helpfulList
            setCurrentHelpfulList((prevState) => devicesList || prevState)
        }
    }, [currentInput]);

    console.log("currentHelpfulList", currentHelpfulList);

    return (
        <div className={currentInputTypesClassName}>
            {/*<input type="text" list="suggestions"/>*/}
            {/*<datalist id="suggestions">*/}
            {/*    {currentHelpfulList.map((item, index) => (*/}
            {/*        <option key={`key=${index}`} value={item}></option>*/}
            {/*    ))}*/}
            {/*</datalist>*/}
            <Input value={value.value}
                   placeholder={currentInput.inputPlaceholder || ""}
                   maxLength={inputValidations[currentInput.type].maxLength}
                   tabIndex={currentInput.id}
                   onBlur={value.onBlur}
                   onChange={value.onChange}
                   datalist={currentHelpfulList.length ? {
                       list: currentHelpfulList,
                       listType: currentInput.type
                   } : undefined}
                   inputIsDirty={value.isDirty}/>
        </div>
    )
};

export default TextInput;
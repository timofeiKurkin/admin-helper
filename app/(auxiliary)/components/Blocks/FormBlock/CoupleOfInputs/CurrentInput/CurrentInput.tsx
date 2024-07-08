import React, {FC} from 'react';
import Text from "@/app/(auxiliary)/components/UI/TextTemplates/Text";
import {AllTypesOfInputs} from "@/app/(auxiliary)/types/Data/Interface/RootPage/RootPageType";
import styles from "./CurrentInput.module.scss";
import useInput from "@/app/(auxiliary)/hooks/useInput";
import FormFieldWrapper
    from "@/app/(auxiliary)/components/UI/Wrappers/FormBlockWrapper/FormFieldWrapper/FormFieldWrapper";
import {
    inputValidations
} from "@/app/(auxiliary)/components/Blocks/FormBlock/CoupleOfInputs/CurrentInput/inputValidations";
import Input from "@/app/(auxiliary)/components/UI/Inputs/Input/Input";


const typeOfInputsClasses: { [key: string]: string } = {
    "device": styles.deviceInputWrapper,
    "message": styles.messageInputWrapper,
    "photo": styles.photoInputWrapper,
    "video": styles.videoInputWrapper,
    "name": styles.nameInputWrapper,
    "company": styles.companyInputWrapper,
    "phone-number": styles.phoneNumberInputWrapper,
    "number-pc": styles.numberPCInputWrapper,
}

interface PropsType {
    currentInput: AllTypesOfInputs;
}

const CurrentInput: FC<PropsType> = ({currentInput}) => {
    const value = useInput("", currentInput.type, inputValidations[currentInput.type])
    const currentInputTypesClassName = typeOfInputsClasses[currentInput.type]

    return (
        <div key={`key=${currentInput.type}`} className={`${styles.currentInputWrapper} ${currentInputTypesClassName}`}>
            <FormFieldWrapper>
                <Text>{currentInput.inputTitle}</Text>

                {
                    !["photo", "video"].includes(currentInput.type) && (
                        <div className={styles.inputWrapper}>
                            <Input value={value.value}
                                   placeholder={currentInput.inputPlaceholder}
                                   maxLength={inputValidations[currentInput.type].maxLength}
                                   tabIndex={currentInput.id}
                                   onBlur={value.onBlur}
                                   onChange={value.onChange}/>
                        </div>
                    )
                }
            </FormFieldWrapper>
        </div>
    )
};

export default CurrentInput;
import React, {FC} from 'react';
import {AllTypesOfInputs} from "@/app/(auxiliary)/types/Data/Interface/RootPage/RootPageType";
import {photoAndVideoInputsData} from "@/app/(auxiliary)/types/AppTypes/InputHooksTypes";
import TextInput from "@/app/(auxiliary)/components/Blocks/FormBlock/CoupleOfInputs/CurrentInput/TextInput/TextInput";
import FileInput from "@/app/(auxiliary)/components/Blocks/FormBlock/CoupleOfInputs/CurrentInput/FileInput/FileInput";
import styles from "@/app/(auxiliary)/components/Blocks/FormBlock/CoupleOfInputs/CurrentInput/CurrentInput.module.scss";
import FormFieldWrapper
    from "@/app/(auxiliary)/components/UI/Wrappers/FormBlockWrapper/FormFieldWrapper/FormFieldWrapper";
import Text from "@/app/(auxiliary)/components/UI/TextTemplates/Text";


const typeOfInputsClasses: { [key: string]: string } = {
    "device": styles.deviceInputWrapper,
    "name": styles.nameInputWrapper,
    "message": styles.messageInputWrapper,
    "company": styles.companyInputWrapper,
    "phone-number": styles.phoneNumberInputWrapper,
    "number-pc": styles.numberPCInputWrapper,
    "photo": styles.photoInputWrapper,
    "video": styles.videoInputWrapper,
}

interface PropsType {
    currentInput: AllTypesOfInputs;
}

const CurrentInput: FC<PropsType> = ({currentInput}) => {
    const currentInputTypesClassName = typeOfInputsClasses[currentInput.type]

    return (
        <div className={`${styles.currentInputWrapper} ${currentInputTypesClassName}`}>
            <FormFieldWrapper>
                <Text>{currentInput.inputTitle}</Text>

                {!photoAndVideoInputsData.includes(currentInput.type) ? (
                    <TextInput currentInput={currentInput}/>
                ) : (
                    <FileInput currentInput={currentInput}/>
                )}
            </FormFieldWrapper>
        </div>
    )
};

export default CurrentInput;
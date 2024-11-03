import React, { FC } from 'react';
import { AllTypesOfInputs, PhoneNumberInputType } from "@/app/(auxiliary)/types/Data/Interface/RootPage/RootPageContentType";
import {
    COMPANY_KEY,
    DEVICE_KEY,
    MESSAGE_KEY,
    NAME_KEY,
    NUMBER_PC_KEY,
    PHONE_KEY,
    PHOTO_KEY,
    requiredFields,
    TextInputsKeysType,
    VIDEO_KEY
} from "@/app/(auxiliary)/types/AppTypes/InputHooksTypes";
import TextInput from "@/app/(auxiliary)/components/Blocks/FormBlock/CoupleOfInputs/CurrentInput/TextInput/TextInput";
import FileInput from "@/app/(auxiliary)/components/Blocks/FormBlock/CoupleOfInputs/CurrentInput/FileInput/FileInput";
import FormFieldWrapper
    from "@/app/(auxiliary)/components/UI/Wrappers/FormBlockWrapper/FormFieldWrapper/FormFieldWrapper";
import Text from "@/app/(auxiliary)/components/UI/TextTemplates/Text";
import Message from "@/app/(auxiliary)/components/Blocks/FormBlock/CoupleOfInputs/CurrentInput/Message/Message";
import PhoneInput
    from "@/app/(auxiliary)/components/Blocks/FormBlock/CoupleOfInputs/CurrentInput/PhoneInput/PhoneInput";
import TextHighlighting from "@/app/(auxiliary)/components/UI/TextHighlighting/TextHighlighting";
import ComputerNumberInput
    from "@/app/(auxiliary)/components/Blocks/FormBlock/CoupleOfInputs/CurrentInput/ComputerNumberInput/ComputerNumberInput";
import { blue_light } from '@/styles/colors';


// const typeOfInputsClasses: { [key: string]: string } = {
//     "device": styles.deviceInputWrapper,
//     "name": styles.nameInputWrapper,
//     "message": styles.messageInputWrapper,
//     "company": styles.companyInputWrapper,
//     "phone-number": styles.phoneNumberInputWrapper,
//     "number-pc": styles.numberPCInputWrapper,
//     "photo": styles.photoInputWrapper,
//     "video": styles.videoInputWrapper,
// }

interface PropsType {
    currentInput: AllTypesOfInputs;
}

const CurrentInput: FC<PropsType> = ({ currentInput }) => {
    const requiredField = requiredFields.includes(currentInput.type as TextInputsKeysType)

    return (
        <FormFieldWrapper>
            {currentInput.type === NUMBER_PC_KEY ? (
                <TextHighlighting wordIndexes={[3, 4]} style={{ fontWeight: 500 }}>
                    <Text>
                        {currentInput.inputTitle}<b style={{ userSelect: "none" }}>*</b>
                    </Text>
                </TextHighlighting>
            ) : (
                <Text>
                    {currentInput.inputTitle}
                    {requiredField ? <b style={{ userSelect: "none" }}>*</b> : null}
                </Text>
            )}

            {currentInput.type === MESSAGE_KEY && (
                <Message inputData={currentInput} />
            )}

            {currentInput.type === PHONE_KEY && (
                <PhoneInput currentInput={currentInput as PhoneNumberInputType} />
            )}

            {currentInput.type === NUMBER_PC_KEY && (
                <ComputerNumberInput placeholder={currentInput.inputPlaceholder!} />
            )}

            {(currentInput.type === NAME_KEY || currentInput.type === DEVICE_KEY || currentInput.type === COMPANY_KEY) && (
                <TextInput currentInput={currentInput} />
            )}

            {(currentInput.type === PHOTO_KEY || currentInput.type === VIDEO_KEY) && (
                <FileInput input={currentInput} />
            )}
        </FormFieldWrapper>
    )
};

export default CurrentInput;
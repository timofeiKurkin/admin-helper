import React, {FC} from 'react';
import {AllTypesOfInputs, PhotoAndVideoInputType} from "@/app/(auxiliary)/types/Data/Interface/RootPage/RootPageType";
import {photoAndVideoInputsData} from "@/app/(auxiliary)/types/AppTypes/InputHooksTypes";
import TextInput from "@/app/(auxiliary)/components/Blocks/FormBlock/CoupleOfInputs/CurrentInput/TextInput/TextInput";
import FileInput from "@/app/(auxiliary)/components/Blocks/FormBlock/CoupleOfInputs/CurrentInput/FileInput/FileInput";
import FormFieldWrapper
    from "@/app/(auxiliary)/components/UI/Wrappers/FormBlockWrapper/FormFieldWrapper/FormFieldWrapper";
import Text from "@/app/(auxiliary)/components/UI/TextTemplates/Text";
import Message from "@/app/(auxiliary)/components/Blocks/FormBlock/CoupleOfInputs/CurrentInput/Message/Message";
import PhoneInput from "@/app/(auxiliary)/components/Blocks/FormBlock/CoupleOfInputs/CurrentInput/PhoneInput/PhoneInput";
import TextHighlighting from "@/app/(auxiliary)/components/UI/TextHighlighting/TextHighlighting";
import ComputerNumberInput
    from "@/app/(auxiliary)/components/Blocks/FormBlock/CoupleOfInputs/CurrentInput/ComputerNumberInput/ComputerNumberInput";


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

const CurrentInput: FC<PropsType> = ({currentInput}) => {
    return (
        <FormFieldWrapper>
            {currentInput.type === "number-pc" ? (
                <TextHighlighting wordIndexes={[3, 4]} style={{fontWeight: 500}}>
                    <Text>{currentInput.inputTitle}</Text>
                </TextHighlighting>
            ) : (
                <Text>{currentInput.inputTitle}</Text>
            )
            }

            {currentInput.type === "message" && (
                <Message currentInput={currentInput}/>
            )}

            {currentInput.type === "phone-number" && (
                <PhoneInput currentInput={currentInput}/>
            )}

            {currentInput.type === "number-pc" && (
                <ComputerNumberInput currentInput={currentInput}/>
            )}

            {![...photoAndVideoInputsData, "message", "phone-number", "number-pc"].includes(currentInput.type) && (
                <TextInput currentInput={currentInput}/>
            )}

            {photoAndVideoInputsData.includes(currentInput.type) && (
                <FileInput currentInput={currentInput as PhotoAndVideoInputType}/>
            )}
        </FormFieldWrapper>
    )
};

export default CurrentInput;
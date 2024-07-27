import React, {FC} from 'react';
import Textarea from "@/app/(auxiliary)/components/UI/Inputs/Textarea/Textarea";
import useInput from "@/app/(auxiliary)/hooks/useInput";
import {
    inputValidations
} from "@/app/(auxiliary)/components/Blocks/FormBlock/CoupleOfInputs/CurrentInput/inputValidations";
import styles from "./MessageInput.module.scss";


interface PropsType {
    placeholder: string;
    type: string;
}

const MessageInput: FC<PropsType> = ({
                                         placeholder,
                                         type
}) => {
    const message = useInput("", type, inputValidations[type]);

    return (
        <div className={styles.messageWrapper}>
            <Textarea value={message.value}
                      placeholder={placeholder}
                      maxLength={inputValidations[type].maxLength}
                      tabIndex={1}
                      onBlur={message.onBlur}
                      onChange={message.onChange}
                      inputIsDirty={message.isDirty}/>
        </div>
    );
};

export default MessageInput;
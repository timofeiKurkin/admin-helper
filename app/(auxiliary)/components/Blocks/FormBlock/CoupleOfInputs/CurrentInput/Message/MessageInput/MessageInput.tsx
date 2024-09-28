import React, {FC} from 'react';
import Textarea from "@/app/(auxiliary)/components/UI/Inputs/Textarea/Textarea";
import useInput from "@/app/(auxiliary)/hooks/useInput";
import {
    inputValidations
} from "@/app/(auxiliary)/components/Blocks/FormBlock/CoupleOfInputs/CurrentInput/inputValidations";
import styles from "../../InputsStyles.module.scss";
import {MESSAGE_KEY} from "@/app/(auxiliary)/types/AppTypes/InputHooksTypes";
import {TextareaChangeEventHandler} from "@/app/(auxiliary)/types/AppTypes/AppTypes";


interface PropsType {
    placeholder: string;
    type: typeof MESSAGE_KEY;
    setNewMessage: (newMessage: string, validationStatus: boolean) => void;
}

const MessageInput: FC<PropsType> = ({
                                         placeholder,
                                         type,
                                         setNewMessage
                                     }) => {
    const message =
        useInput<HTMLTextAreaElement>("", type, inputValidations[type]);

    const onChangeHandler = (e: TextareaChangeEventHandler) => {
        message.onChange(e)
        setNewMessage(e.target.value, message.inputValid)
    }

    return (
        <div className={styles.messageWrapper}>
            <Textarea value={message.value}
                      placeholder={placeholder}
                      maxLength={inputValidations[type].maxLength}
                      tabIndex={1}
                      onBlur={message.onBlur}
                      onChange={onChangeHandler}
                      inputIsDirty={message.isDirty}/>
        </div>
    );
};

export default MessageInput;
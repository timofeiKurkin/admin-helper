import {
    inputValidations
} from "@/app/(auxiliary)/components/Blocks/FormBlock/CoupleOfInputs/CurrentInput/inputValidations";
import InputErrorLayout from '@/app/(auxiliary)/components/UI/Inputs/InputErrorLayout/InputErrorLayout';
import Textarea from "@/app/(auxiliary)/components/UI/Inputs/Textarea/Textarea";
import useInput from "@/app/(auxiliary)/hooks/useInput";
import { useAppSelector } from "@/app/(auxiliary)/libs/redux-toolkit/store/hooks";
import {
    selectServerResponse
} from "@/app/(auxiliary)/libs/redux-toolkit/store/slices/UserFormDataSlice/UserFormDataSlice";
import { TextareaChangeEventHandler } from "@/app/(auxiliary)/types/AppTypes/AppTypes";
import { MESSAGE_KEY } from "@/app/(auxiliary)/types/AppTypes/InputHooksTypes";
import { FC, useEffect } from 'react';
import styles from "../../InputsStyles.module.scss";


interface PropsType {
    placeholder: string;
    type: typeof MESSAGE_KEY;
    setNewMessage: (newMessage: string, validationStatus: boolean) => void;
    isError: boolean;
    setErrorHandler: (status: boolean) => void;
}



const MessageInput: FC<PropsType> = ({
    placeholder,
    type,
    setNewMessage,
    isError,
    setErrorHandler
}) => {
    const serverResponse = useAppSelector(selectServerResponse).status
    const value = useInput("", type, inputValidations[type]);

    const onChange = (e: TextareaChangeEventHandler) => {
        value.onChange(e)
    }

    // Update app state when value was changed.
    // Helpful when input gets value from localStorage and changes app state
    useEffect(() => {
        if (value.value) {
            setNewMessage(value.value, value.inputValid)
        }

        // return () => {
        //     setNewMessage("", false)
        // }
    }, [
        value.inputValid,
        value.value
    ]);

    // Reset input after sending help request from client to server
    // Will work when server response is "success", otherwise the value will be
    useEffect(() => {
        if (serverResponse === "success") {
            value.resetValue()
        }
    }, [
        serverResponse,
        value
    ]);

    return (
        <div className={styles.messageWrapper}>
            <InputErrorLayout value={value}
                type={type}
                setIsError={setErrorHandler}
                isError={isError}>
                <Textarea value={value.value}
                    placeholder={placeholder}
                    maxLength={inputValidations[type].maxLength}
                    tabIndex={1}
                    onBlur={value.onBlur}
                    onChange={onChange}
                    inputIsDirty={value.isDirty}
                    isError={isError} />
            </InputErrorLayout>
        </div>
    );
};

export default MessageInput;
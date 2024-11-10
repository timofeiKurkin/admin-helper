"use client"

import MessageInput from "@/app/(auxiliary)/components/Blocks/FormBlock/CoupleOfInputs/CurrentInput/Message/MessageInput/MessageInput";
import VoiceInput from "@/app/(auxiliary)/components/Blocks/FormBlock/CoupleOfInputs/CurrentInput/Message/VoiceInput/VoiceInput";
import Toggle from "@/app/(auxiliary)/components/Common/Switches/Toggle/Toggle";
import { useAppDispatch, useAppSelector } from "@/app/(auxiliary)/libs/redux-toolkit/store/hooks";
import {
    selectUserDevice,
    setOpenedPhotoBlock,
    setSwitchedMessageBlock
} from "@/app/(auxiliary)/libs/redux-toolkit/store/slices/AppSlice/AppSlice";
import {
    addMessageData,
    changeMessageInputDataType,
    deleteMessageRecorder,
    deleteRejectionInput,
    selectMessageInputDataType,
    selectRejectionInputs
} from "@/app/(auxiliary)/libs/redux-toolkit/store/slices/UserFormDataSlice/UserFormDataSlice";
import { MessageInputDataType, TextInputsKeysType } from "@/app/(auxiliary)/types/AppTypes/InputHooksTypes";
import { MessageInputType } from "@/app/(auxiliary)/types/Data/Interface/RootPage/RootPageContentType";
import { FC, useCallback, useEffect, useState } from 'react';
import styles from "./Message.module.scss";

interface PropsType {
    currentInput: MessageInputType;
}

const Message: FC<PropsType> = ({ currentInput }) => {
    const dispatch = useAppDispatch()
    // const userCannotTalk = useAppSelector(selectUserMessageStatus)
    const dataOfMessageType = useAppSelector(selectMessageInputDataType)
    const rejectionInputs = useAppSelector(selectRejectionInputs)
    const userDevice = useAppSelector(selectUserDevice)


    /**
     * false - "file" data type of the message
     * true - "text" data type of message
    */
    const [userCannotTalk, setUserCannotTalk] = useState(false)
    const [isError, setIsError] = useState<boolean>(false)
    const setErrorHandler = (status: boolean) => setIsError(status)

    const setNewMessageHandler = useCallback((
        newMessage: File | string,
        validationStatus: boolean
    ) => {
        if (isError && rejectionInputs.includes(currentInput.type as TextInputsKeysType)) {
            dispatch(deleteRejectionInput(currentInput.type as TextInputsKeysType))
            setErrorHandler(false)
        }

        dispatch(addMessageData({
            validationStatus,
            value: newMessage
        }))
    }, [dispatch, currentInput, isError, rejectionInputs])

    const removerRecorderHandler = () => {
        dispatch(deleteMessageRecorder())
    }


    const changeMessageTypeHandler = (newType: MessageInputDataType) => {
        setUserCannotTalk((prevState) => !prevState)
        dispatch(changeMessageInputDataType(newType))
    }

    useEffect(() => {
        if (userDevice.padAdaptive640_992) {
            dispatch(setOpenedPhotoBlock(userCannotTalk))
        } else {
            dispatch(setSwitchedMessageBlock(userCannotTalk))
        }
    }, [
        dispatch,
        userCannotTalk,
        userDevice.padAdaptive640_992
    ]);

    return (
        <div className={styles.messageWrapper}>
            {
                !userCannotTalk && (
                    <VoiceInput voicePlaceholder={currentInput.voiceMessage}
                        setNewMessage={setNewMessageHandler}
                        isError={isError}
                        setErrorHandler={setErrorHandler}
                        removeRecorder={removerRecorderHandler} />
                )
            }

            <Toggle toggleStatus={userCannotTalk}
                onClick={() => changeMessageTypeHandler(dataOfMessageType === "file" ? "text" : "file")}>
                {currentInput.toggleText}
            </Toggle>

            {
                userCannotTalk && (
                    <MessageInput type={currentInput.type}
                        placeholder={currentInput.textMessage!.inputPlaceholder}
                        isError={isError}
                        setErrorHandler={setErrorHandler}
                        setNewMessage={setNewMessageHandler} />
                )
            }
        </div>
    );
};

export default Message;
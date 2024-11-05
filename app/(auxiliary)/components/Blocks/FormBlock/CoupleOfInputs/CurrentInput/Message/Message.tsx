"use client"

import React, { FC, useCallback, useEffect, useState } from 'react';
import Toggle from "@/app/(auxiliary)/components/Common/Switches/Toggle/Toggle";
import { MessageInputType } from "@/app/(auxiliary)/types/Data/Interface/RootPage/RootPageContentType";
import VoiceInput
    from "@/app/(auxiliary)/components/Blocks/FormBlock/CoupleOfInputs/CurrentInput/Message/VoiceInput/VoiceInput";
import styles from "./Message.module.scss"
import MessageInput
    from "@/app/(auxiliary)/components/Blocks/FormBlock/CoupleOfInputs/CurrentInput/Message/MessageInput/MessageInput";
import { MESSAGE_KEY, TextInputsKeysType } from "@/app/(auxiliary)/types/AppTypes/InputHooksTypes";
import { useAppDispatch, useAppSelector } from "@/app/(auxiliary)/libs/redux-toolkit/store/hooks";
import {
    selectUserDevice,
    setOpenedPhotoBlock,
    setSwitchedMessageBlock
} from "@/app/(auxiliary)/libs/redux-toolkit/store/slices/AppSlice/AppSlice";
import {
    addMessageData,
    deleteMessageRecorder,
    deleteRejectionInput,
    selectRejectionInputs,
    selectUserMessageStatus,
    switchUserMessageStatus
} from "@/app/(auxiliary)/libs/redux-toolkit/store/slices/UserFormDataSlice/UserFormDataSlice";
import InputErrorLayout from '@/app/(auxiliary)/components/UI/Inputs/InputErrorLayout/InputErrorLayout';

interface PropsType {
    currentInput: MessageInputType;
}

const Message: FC<PropsType> = ({ currentInput }) => {
    const dispatch = useAppDispatch()
    const userCannotTalk = useAppSelector(selectUserMessageStatus)
    const rejectionInputs = useAppSelector(selectRejectionInputs)
    const userDevice = useAppSelector(selectUserDevice)

    const [isError, setIsError] = useState<boolean>(false)
    const setErrorHandler = (status: boolean) => setIsError(status)

    // console.log("rejectionInputs: ", rejectionInputs)
    // console.log("isError: ", isError)

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


    const switchTypeMessageHandler = () => {
        dispatch(switchUserMessageStatus())
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
                onClick={switchTypeMessageHandler}>
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
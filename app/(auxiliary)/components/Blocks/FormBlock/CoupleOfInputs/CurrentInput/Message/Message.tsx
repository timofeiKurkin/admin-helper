import React, {FC, useEffect, useState} from 'react';
import Toggle from "@/app/(auxiliary)/components/Common/Switches/Toggle/Toggle";
import {MessageInputType} from "@/app/(auxiliary)/types/Data/Interface/RootPage/RootPageContentType";
import VoiceInput
    from "@/app/(auxiliary)/components/Blocks/FormBlock/CoupleOfInputs/CurrentInput/Message/VoiceInput/VoiceInput";
import styles from "./Message.module.scss"
import MessageInput
    from "@/app/(auxiliary)/components/Blocks/FormBlock/CoupleOfInputs/CurrentInput/Message/MessageInput/MessageInput";
import {MESSAGE_KEY} from "@/app/(auxiliary)/types/AppTypes/InputHooksTypes";
import {useAppDispatch, useAppSelector} from "@/app/(auxiliary)/libs/redux-toolkit/store/hooks";
import {
    selectUserDevice,
    setOpenedPhotoBlock,
    setSwitchedMessageBlock
} from "@/app/(auxiliary)/libs/redux-toolkit/store/slices/AppSlice/AppSlice";
import {
    addMessageData,
    deleteMessageRecorder
} from "@/app/(auxiliary)/libs/redux-toolkit/store/slices/UserFormDataSlice/UserFormDataSlice";

interface PropsType {
    inputData: MessageInputType;
}

const Message: FC<PropsType> = ({inputData}) => {
    const [userCannotTalk, setUserCannotTalk] =
        useState<boolean>(false)
    const userDevice = useAppSelector(selectUserDevice)
    const dispatch = useAppDispatch()

    const setNewMessageHandler = (
        newMessage: File | string,
        validationStatus: boolean
    ) => {
        console.log("set new message func")
        dispatch(addMessageData({
            validationStatus,
            value: newMessage
        }))
    }

    const removerRecorderHandler = () => {
        dispatch(deleteMessageRecorder())
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

    const switchTypeMessageHandler = () => {
        setUserCannotTalk((prevState) => !prevState)
    }

    return (
        <div className={styles.messageWrapper}>
            {
                !userCannotTalk && (
                    <VoiceInput voicePlaceHolder={inputData.voiceMessage?.inputPlaceholder}
                                    setNewMessage={setNewMessageHandler}
                                    removeRecoder={removerRecorderHandler}/>
                )
            }

            <Toggle toggleStatus={userCannotTalk}
                    onClick={switchTypeMessageHandler}>
                {inputData.toggleText}
            </Toggle>

            {
                userCannotTalk && (
                    <MessageInput type={inputData.type as typeof MESSAGE_KEY}
                                  placeholder={inputData.textMessage?.inputPlaceholder || ""}
                                  setNewMessage={setNewMessageHandler}/>
                )
            }
        </div>
    );
};

export default Message;
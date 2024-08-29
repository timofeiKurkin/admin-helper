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
    addFileData,
    changeTextData
} from "@/app/(auxiliary)/libs/redux-toolkit/store/slices/UserFormDataSlice/UserFormDataSlice";

interface PropsType {
    currentInput: MessageInputType;
}

const Message: FC<PropsType> = ({currentInput}) => {
    const [userCannotTalk, setUserCannotTalk] =
        useState<boolean>(false);
    const userDevice = useAppSelector(selectUserDevice)
    const dispatch = useAppDispatch()

    // const {appState, setAppState} = useContext(AppContext)

    const setNewMessageHandler = (
        newMessage: File | string,
        validationStatus: boolean
    ) => {
        if(typeof newMessage === "string") {
            dispatch(changeTextData({
                key: currentInput.type,
                data: {
                    validationStatus,
                    value: newMessage
                }
            }))
        } else if (newMessage instanceof File) {
            dispatch(addFileData({
                key: currentInput.type,
                data: {
                    validationStatus,
                    value: [newMessage]
                }
            }))
        }

        // updateFormsDataState({
        //     setAppState,
        //     newValue: {
        //         validationStatus,
        //         value: newMessage
        //     },
        //     key: currentInput.type
        // })
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
                    <div className={styles.voiceWrapper}>
                        <VoiceInput voicePlaceHolder={currentInput.voiceMessage?.inputPlaceholder}
                                    setNewMessage={setNewMessageHandler}/>
                    </div>
                )
            }

            <Toggle toggleStatus={userCannotTalk}
                    onClick={switchTypeMessageHandler}>
                {currentInput.toggleText}
            </Toggle>

            {
                userCannotTalk && (
                    <MessageInput type={currentInput.type as typeof MESSAGE_KEY}
                                  placeholder={currentInput.textMessage?.inputPlaceholder || ""}
                                  setNewMessage={setNewMessageHandler}/>
                )
            }
        </div>
    );
};

export default Message;
import React, {FC, useContext, useEffect, useState} from 'react';
import Toggle from "@/app/(auxiliary)/components/Common/Switches/Toggle/Toggle";
import {MessageInputType} from "@/app/(auxiliary)/types/Data/Interface/RootPage/RootPageType";
import VoiceInput
    from "@/app/(auxiliary)/components/Blocks/FormBlock/CoupleOfInputs/CurrentInput/Message/VoiceInput/VoiceInput";
import styles from "./Message.module.scss"
import MessageInput
    from "@/app/(auxiliary)/components/Blocks/FormBlock/CoupleOfInputs/CurrentInput/Message/MessageInput/MessageInput";
import {AppContext} from "@/app/(auxiliary)/components/Common/Provider/Provider";
import {updateFormsDataState} from "@/app/(auxiliary)/func/updateFormsDataState";

interface PropsType {
    currentInput: MessageInputType;
}

const Message: FC<PropsType> = ({currentInput}) => {
    const [userCannotTalk, setUserCannotTalk] =
        useState<boolean>(false);
    const {appState, setAppState} = useContext(AppContext)

    const setNewMessageHandler = (
        newMessage: File | string,
        validationStatus: boolean
    ) => {
        updateFormsDataState({
            setAppState,
            newValue: {
                validationStatus,
                value: newMessage
            },
            key: currentInput.type
        })
    }

    useEffect(() => {
        if (appState.userDevice?.padAdaptive640_992) {
            setAppState((prevState) => {
                return {
                    ...prevState,
                    openedPhotoBlock: userCannotTalk
                }
            })
        } else {
            setAppState((prevState) => {
                return {
                    ...prevState,
                    switchedMessageBlock: userCannotTalk
                }
            })
        }
    }, [
        appState.userDevice,
        setAppState,
        userCannotTalk
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
                    <MessageInput type={currentInput.type}
                                  placeholder={currentInput.textMessage?.inputPlaceholder || ""}
                                  setNewMessage={setNewMessageHandler}/>
                )
            }
        </div>
    );
};

export default Message;
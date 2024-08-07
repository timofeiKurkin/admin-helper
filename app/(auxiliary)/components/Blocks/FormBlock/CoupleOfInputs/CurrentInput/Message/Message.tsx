import React, {FC, useContext, useEffect, useState} from 'react';
import Toggle from "@/app/(auxiliary)/components/Common/Switches/Toggle/Toggle";
import {MessageInputType} from "@/app/(auxiliary)/types/Data/Interface/RootPage/RootPageType";
import VoiceInput
    from "@/app/(auxiliary)/components/Blocks/FormBlock/CoupleOfInputs/CurrentInput/Message/VoiceInput/VoiceInput";
import styles from "./Message.module.scss"
import MessageInput
    from "@/app/(auxiliary)/components/Blocks/FormBlock/CoupleOfInputs/CurrentInput/Message/MessageInput/MessageInput";
import {AppContext} from "@/app/(auxiliary)/components/Common/Provider/Provider";

interface PropsType {
    currentInput: MessageInputType;
}

const Message: FC<PropsType> = ({currentInput}) => {
    const [userCannotTalk, setUserCannotTalk] =
        useState<boolean>(false);
    const {appState, setAppState} = useContext(AppContext)

    const setNewMessageHandler = (newMessage: File | string) => {
        if (typeof newMessage === "string") {
            setAppState({
                ...appState,
                userDataFromForm: {
                    ...appState.userDataFromForm,
                    textData: {
                        ...appState.userDataFromForm?.textData,
                        [currentInput.type]: newMessage
                    }
                }
            })
        }

        if (newMessage instanceof File) {
            setAppState({
                ...appState,
                userDataFromForm: {
                    ...appState.userDataFromForm,
                    fileData: {
                        ...appState.userDataFromForm?.fileData,
                        [currentInput.type]: newMessage
                    }
                }
            })
        }
    }

    useEffect(() => {

    }, []);

    const switchTypeMessageHandler = () => {
        setUserCannotTalk((prevState) => !prevState)

        if (appState.userDevice?.desktopAdaptive) {
            setAppState({
                ...appState,
                switchedMessageBlock: !userCannotTalk ? !userCannotTalk : !appState.switchedMessageBlock
            })
        } else {
            setAppState({
                ...appState,
                openedPhotoBlock: !userCannotTalk ? !userCannotTalk : !appState.openedPhotoBlock
            })
        }
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
import React, {FC, useContext, useState} from 'react';
import Toggle from "@/app/(auxiliary)/components/Common/Switches/Toggle/Toggle";
import {MessageInputType} from "@/app/(auxiliary)/types/Data/Interface/RootPage/RootPageType";
import VoiceInput
    from "@/app/(auxiliary)/components/Blocks/FormBlock/CoupleOfInputs/CurrentInput/Message/VoiceInput/VoiceInput";
import styles from "./Message.module.scss"
import Textarea from "@/app/(auxiliary)/components/UI/Inputs/Textarea/Textarea";
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

    const switchTypeMessageHandler = () => {
        setUserCannotTalk((prevState) => !prevState)

        setAppState({
            ...appState,
            switchedMessageBlock: !userCannotTalk ? !userCannotTalk : !appState.switchedMessageBlock
        })
    }

    return (
        <div className={styles.messageWrapper}>
            {
                !userCannotTalk && (
                    <VoiceInput voicePlaceHolder={currentInput.voiceMessage?.inputPlaceholder}/>
                )
            }

            <Toggle toggleStatus={userCannotTalk}
                    onClick={switchTypeMessageHandler}>
                {currentInput.toggleText}
            </Toggle>

            {
                userCannotTalk && (
                    <MessageInput type={currentInput.type}
                                  placeholder={currentInput.textMessage?.inputPlaceholder || ""}/>
                )
            }
        </div>
    );
};

export default Message;
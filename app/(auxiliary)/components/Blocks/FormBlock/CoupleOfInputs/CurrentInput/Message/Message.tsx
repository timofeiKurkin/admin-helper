import React, {FC, useState} from 'react';
import Toggle from "@/app/(auxiliary)/components/Common/Switches/Toggle/Toggle";
import {MessageInputType} from "@/app/(auxiliary)/types/Data/Interface/RootPage/RootPageType";
import VoiceInput
    from "@/app/(auxiliary)/components/Blocks/FormBlock/CoupleOfInputs/CurrentInput/Message/VoiceInput/VoiceInput";
import styles from "./Message.module.scss"
import Textarea from "@/app/(auxiliary)/components/UI/Inputs/Textarea/Textarea";
import MessageInput
    from "@/app/(auxiliary)/components/Blocks/FormBlock/CoupleOfInputs/CurrentInput/Message/MessageInput/MessageInput";

interface PropsType {
    currentInput: MessageInputType;
}

const Message: FC<PropsType> = ({currentInput}) => {
    const [userCannotTalk, setUserCannotTalk] =
        useState<boolean>(false);

    return (
        <div className={styles.messageWrapper}>
            {
                !userCannotTalk ? (
                    <VoiceInput voicePlaceHolder={currentInput.voiceMessage?.inputPlaceholder}/>
                ) : (
                    <MessageInput type={currentInput.type}
                                  placeholder={currentInput.textMessage?.inputPlaceholder || ""}/>
                )
            }

            <Toggle toggleStatus={userCannotTalk}
                    onClick={() => setUserCannotTalk((prevState) => !prevState)}>
                {currentInput.toggleText}
            </Toggle>
        </div>
    );
};

export default Message;
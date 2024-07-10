import React, {FC, useState} from 'react';
import Toggle from "@/app/(auxiliary)/components/Common/Switches/Toggle/Toggle";
import {MessageInputType} from "@/app/(auxiliary)/types/Data/Interface/RootPage/RootPageType";
import VoiceInput
    from "@/app/(auxiliary)/components/Blocks/FormBlock/CoupleOfInputs/CurrentInput/Message/VoiceInput/VoiceInput";
import styles from "./Message.module.scss"

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
                    <div style={{
                        width: "21.5625rem",
                        border: "1px solid gray",
                    }}>textarea</div>
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
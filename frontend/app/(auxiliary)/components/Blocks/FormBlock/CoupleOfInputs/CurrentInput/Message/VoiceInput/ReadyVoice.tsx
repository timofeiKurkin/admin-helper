import React, { FC } from 'react';
import Button from "@/app/(auxiliary)/components/UI/Button/Button";
import AudioPlayer
    from "@/app/(auxiliary)/components/Blocks/FormBlock/CoupleOfInputs/CurrentInput/Message/VoiceInput/AudioPlayer";
import Trash from "@/app/(auxiliary)/components/UI/SVG/Trash/Trash";
import { red_dark } from "@/styles/colors";
import styles from "./AudioPlayer.module.scss"

interface PropsType {
    audioBlob: Blob;
    removeCurrentRecord: () => void;
}

const ReadyVoice: FC<PropsType> = ({
    audioBlob,
    removeCurrentRecord
}) => {
    return (
        <div className={styles.readyVoiceWrapper}>
            {audioBlob && (
                <AudioPlayer audioBlob={audioBlob} />
            )}

            <Button image={{
                children: <Trash />,
                visibleOnlyImage: true,
            }}
                onClick={removeCurrentRecord}
                style={{
                    backgroundColor: red_dark
                }}
            />
        </div>
    );
};

export default ReadyVoice;
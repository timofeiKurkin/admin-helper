import React, {FC} from 'react';
import Button from "@/app/(auxiliary)/components/UI/Button/Button";
import AudioPlayer
    from "@/app/(auxiliary)/components/Blocks/FormBlock/CoupleOfInputs/CurrentInput/Message/VoiceInput/AudioPlayer";
import Trash from "@/app/(auxiliary)/components/UI/SVG/Trash/Trash";
import {red_dark} from "@/styles/colors";

interface PropsType {
    audioBlob: Blob;
    removeCurrentRecord: () => void;
}

const ReadyVoice: FC<PropsType> = ({
                                       audioBlob,
                                       removeCurrentRecord
                                   }) => {
    return (
        <div style={{
            display: "grid",
            gridTemplateColumns: "3.3125rem 9.875rem 3.3125rem",
            gridTemplateRows: "3.3125rem",
            columnGap: "0.94rem",
        }}>
            <AudioPlayer audioBlob={audioBlob}/>

            <Button image={{
                children: <Trash/>,
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
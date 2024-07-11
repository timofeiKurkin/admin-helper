import React, {FC} from 'react';
import Button from "@/app/(auxiliary)/components/UI/Button/Button";
import Replay from "@/app/(auxiliary)/components/UI/SVG/Replay/Replay";
import AudioPlayer
    from "@/app/(auxiliary)/components/Blocks/FormBlock/CoupleOfInputs/CurrentInput/Message/VoiceInput/AudioPlayer";

interface PropsType {
    audioBlob: Blob;
}

const ReadyVoice: FC<PropsType> = ({ audioBlob}) => {
    return (
        <div style={{
            display: "grid",
            gridTemplateColumns: "3.3125rem 9.875rem 3.3125rem",
            gridTemplateRows: "3.3125rem",
            columnGap: "0.94rem",
        }}>
            <AudioPlayer audioBlob={audioBlob}/>

            <Button image={{
                children: <Replay/>,
                visibleOnlyImage: true,
            }}/>
        </div>
    );
};

export default ReadyVoice;
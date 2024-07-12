"use client"

import React, {FC, useRef, useState} from "react";
import Button from "@/app/(auxiliary)/components/UI/Button/Button";
import Microphone from "@/app/(auxiliary)/components/UI/SVG/Microphone/Microphone";
import {blue_dark, blue_light} from "@/styles/colors";
import ReadyVoice
    from "@/app/(auxiliary)/components/Blocks/FormBlock/CoupleOfInputs/CurrentInput/Message/VoiceInput/ReadyVoice";
import {object} from "prop-types";

interface PropsType {
    voicePlaceHolder?: string;
}

const VoiceInput: FC<PropsType> = ({voicePlaceHolder}) => {
    const [isRecording, setIsRecording] = useState(false);
    const [recordingIsDone, setRecordingIsDone] = useState<boolean>(false);

    // const [audioURL, setAudioURL] = useState("");
    const [audioFile, setAudioFile] = useState<Blob | null>(null);

    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const audioChunksRef = useRef<Blob[]>([]);

    const startRecording = async () => {
        setIsRecording(true);
        audioChunksRef.current = [];
        const stream = await navigator.mediaDevices.getUserMedia({audio: true});
        mediaRecorderRef.current = new MediaRecorder(stream);

        mediaRecorderRef.current.ondataavailable = (event) => {
            audioChunksRef.current.push(event.data);
        };

        mediaRecorderRef.current.onstop = () => {
            const audioBlob = new Blob(audioChunksRef.current, {type: "audio/wav"});
            const audioURL = URL.createObjectURL(audioBlob);
            setAudioFile(audioBlob)
        };

        mediaRecorderRef.current.start();
    }

    const stopRecording = () => {
        setIsRecording((prevState) => !prevState);
        setRecordingIsDone((prevState) => !prevState);

        if (mediaRecorderRef.current) {
            mediaRecorderRef.current.stop()
        }
    }

    const deleteCurrentRecord = () => {
        setRecordingIsDone((prevState) => !prevState);

        if (audioFile) {
            setAudioFile(null)
        }
    }

    if(!audioFile && !recordingIsDone) {
        return (
            <Button onClick={isRecording ? () => stopRecording() : () => startRecording()}
                    style={{
                        backgroundColor: isRecording ? blue_light : blue_dark
                    }}
                    image={{
                        position: "left",
                        children: <Microphone/>,
                        visibleOnlyImage: false
                    }}>
                {isRecording ? "Говорите" : voicePlaceHolder}
            </Button>
        )
    } else if (audioFile && recordingIsDone) {
        return (
            <ReadyVoice audioBlob={audioFile}
                        removeCurrentRecord={() => deleteCurrentRecord()}/>
        )
    }
};

export default VoiceInput;
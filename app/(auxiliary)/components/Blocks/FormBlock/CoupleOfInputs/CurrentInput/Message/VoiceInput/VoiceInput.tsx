"use client"

import React, {FC, useEffect, useRef, useState} from "react";
import Button from "@/app/(auxiliary)/components/UI/Button/Button";
import Microphone from "@/app/(auxiliary)/components/UI/SVG/Microphone/Microphone";
import {blue_dark, blue_light} from "@/styles/colors";
import ReadyVoice
    from "@/app/(auxiliary)/components/Blocks/FormBlock/CoupleOfInputs/CurrentInput/Message/VoiceInput/ReadyVoice";
import {formattedTime} from "@/app/(auxiliary)/func/formattedTime";

interface PropsType {
    voicePlaceHolder?: string;
    setNewMessage: (newMessage: File, validationStatus: boolean) => void;
}

const VoiceInput: FC<PropsType> = ({
                                       voicePlaceHolder,
                                       setNewMessage
                                   }) => {
    const [isRecording, setIsRecording] = useState(false)
    const [recordingIsDone, setRecordingIsDone] = useState<boolean>(false)

    // const [audioURL, setAudioURL] = useState("");
    const [audioBlob, setAudioBlob] = useState<Blob | null>(null)

    const mediaRecorderRef = useRef<MediaRecorder | null>(null)
    const audioChunksRef = useRef<Blob[]>([])

    const startRecording = async () => {
        setIsRecording(true)
        audioChunksRef.current = []
        const stream = await navigator.mediaDevices.getUserMedia({audio: true})
        mediaRecorderRef.current = new MediaRecorder(stream)

        mediaRecorderRef.current.ondataavailable = (event) => {
            audioChunksRef.current.push(event.data)
        }

        mediaRecorderRef.current.onstop = () => {
            const blob = new Blob(audioChunksRef.current, {type: "audio/wav"})

            if (blob) {
                // setNewMessage(audioFile, true)
                setAudioBlob(blob)
            }
        };

        mediaRecorderRef.current.start();
    }

    const stopRecording = () => {
        setIsRecording((prevState) => !prevState)
        setRecordingIsDone((prevState) => !prevState)

        if (mediaRecorderRef.current) {
            mediaRecorderRef.current.stop()
        }
    }

    const deleteCurrentRecord = () => {
        setRecordingIsDone((prevState) => !prevState);

        if (audioBlob) {
            setAudioBlob(null)
            setNewMessage({} as File, false)
        }
    }

    useEffect(() => {
        if (audioBlob) {
            const audioFile = new File([audioBlob], `user-record-${formattedTime()}`, {
                type: "audio/wav",
                lastModified: new Date().getDate(),
            })
            setNewMessage(audioFile, true)
        }

        return () => {
            setNewMessage({} as File, false)
        }
    }, [
        audioBlob,
        // setNewMessage
    ]);

    if (!audioBlob && !recordingIsDone) {
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
    } else if (audioBlob && recordingIsDone) {
        return (
            <ReadyVoice audioBlob={audioBlob}
                        removeCurrentRecord={() => deleteCurrentRecord()}/>
        )
    }
};

export default VoiceInput;
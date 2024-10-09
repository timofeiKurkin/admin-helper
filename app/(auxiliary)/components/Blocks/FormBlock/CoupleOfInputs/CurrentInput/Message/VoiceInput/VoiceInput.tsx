"use client"

import React, {FC, useEffect, useRef, useState} from "react";
import Button from "@/app/(auxiliary)/components/UI/Button/Button";
import Microphone from "@/app/(auxiliary)/components/UI/SVG/Microphone/Microphone";
import {blue_dark, blue_light} from "@/styles/colors";
import ReadyVoice
    from "@/app/(auxiliary)/components/Blocks/FormBlock/CoupleOfInputs/CurrentInput/Message/VoiceInput/ReadyVoice";
import {useAppSelector} from "@/app/(auxiliary)/libs/redux-toolkit/store/hooks";
import {
    selectFormFileData, selectServerResponse
} from "@/app/(auxiliary)/libs/redux-toolkit/store/slices/UserFormDataSlice/UserFormDataSlice";
import {MESSAGE_KEY} from "@/app/(auxiliary)/types/AppTypes/InputHooksTypes";
import {formattedTime} from "@/app/(auxiliary)/func/formattedTime";
import styles from "./AudioPlayer.module.scss";
import AllowToUseMicrophone
    from "@/app/(auxiliary)/components/Blocks/FormBlock/CoupleOfInputs/CurrentInput/Message/VoiceInput/AllowToUseMicrophone";

interface PropsType {
    voicePlaceHolder?: string;
    setNewMessage: (newMessage: File, validationStatus: boolean) => void;
    removeRecoder: () => void;
}

const VoiceInput: FC<PropsType> = ({
                                       voicePlaceHolder,
                                       setNewMessage,
                                       removeRecoder
                                   }) => {
    const voiceMessage = useAppSelector(selectFormFileData)[MESSAGE_KEY]
    const serverResponse = useAppSelector(selectServerResponse).sentToServer

    const [isRecording, setIsRecording] =
        useState(false)
    const [recordingIsDone, setRecordingIsDone] =
        useState<boolean>(voiceMessage.value instanceof File)
    const [microphonePermission, setMicrophonePermission] = useState<PermissionState>()

    const [audioBlob, setAudioBlob] =
        useState<Blob | null>(() => {
            if (voiceMessage.value instanceof File) {
                return new Blob(
                    [voiceMessage.value],
                    {type: voiceMessage.value.type}
                )
            }

            return null
        })

    const mediaRecorderRef = useRef<MediaRecorder | null>(null)
    const audioChunksRef = useRef<Blob[]>([])

    const startRecording = async () => {
        setIsRecording((prevState) => !prevState)
        audioChunksRef.current = []
        /**
         * Доступ к микрофону пользователя
         */
        const stream = await navigator.mediaDevices.getUserMedia({audio: true, video: false})
        mediaRecorderRef.current = new MediaRecorder(stream)

        mediaRecorderRef.current.ondataavailable = (event) => {
            audioChunksRef.current.push(event.data)
        }

        mediaRecorderRef.current.onstop = () => {
            const blob = new Blob(audioChunksRef.current, {type: "audio/mp3"})

            if (blob) {
                setAudioBlob(blob)

                const newAudioFile = new File(
                    [blob],
                    `voice-record-${formattedTime()}`,
                    {
                        type: "audio/mp3",
                        lastModified: Date.now()
                    }
                )
                setNewMessage(newAudioFile, true)
            }

            /**
             * Отключение всех дорожек и, соответственно, использование микрофона
             */
            stream.getTracks().forEach(track => track.stop());
        };

        mediaRecorderRef.current.start();
    }

    const stopRecording = () => {
        if (mediaRecorderRef.current) {
            mediaRecorderRef.current.stop()
        }

        setIsRecording((prevState) => !prevState)
        setRecordingIsDone((prevState) => !prevState)
    }

    const deleteCurrentRecord = () => {
        removeRecoder()
        setRecordingIsDone(false)
        setAudioBlob(null)
    }

    useEffect(() => {
        if (serverResponse) {
            setAudioBlob(null)
            setRecordingIsDone(false)
        }
    }, [
        serverResponse
    ]);

    useEffect(() => {
        navigator.permissions.query({name: "microphone" as PermissionName}).then((permissions) => {
            // The permissions.state can be 'granted', 'denied', or 'prompt'
            // You can control the permission to use user's microphone
            setMicrophonePermission(permissions.state)

            permissions.onchange = (ev) => {
                console.log("new perm?:", permissions.state)
                console.log("ev of the arg:", ev)
                setMicrophonePermission(permissions.state)
            }
        })
    }, []);

    console.log("microphonePermission: ", microphonePermission)

    return (
        <>
            <div className={styles.voiceInputWrapper}>
                {(audioBlob && recordingIsDone) ? (
                    <ReadyVoice audioBlob={audioBlob}
                                removeCurrentRecord={deleteCurrentRecord}/>
                ) : (
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
                )}
            </div>

            {isRecording && microphonePermission === "prompt" ? (
                <AllowToUseMicrophone isRecording={isRecording}
                                  microphonePermission={microphonePermission}
                                  stopRecording={stopRecording}/>
            ) : null}
        </>
    )
};

export default VoiceInput;
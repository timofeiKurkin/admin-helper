"use client"

// import {File} from "@web-stb/file"
import AllowToUseMicrophone from "@/app/(auxiliary)/components/Blocks/FormBlock/CoupleOfInputs/CurrentInput/Message/VoiceInput/AllowToUseMicrophone";
import ReadyVoice from "@/app/(auxiliary)/components/Blocks/FormBlock/CoupleOfInputs/CurrentInput/Message/VoiceInput/ReadyVoice";
import Button from "@/app/(auxiliary)/components/UI/Button/Button";
import Microphone from "@/app/(auxiliary)/components/UI/SVG/Microphone/Microphone";
import { formattedTime } from "@/app/(auxiliary)/func/formattedTime";
import { useAppDispatch, useAppSelector } from "@/app/(auxiliary)/libs/redux-toolkit/store/hooks";
import {
    selectFormFileData,
    selectRejectionInputs,
    selectServerResponse
} from "@/app/(auxiliary)/libs/redux-toolkit/store/slices/UserFormDataSlice/UserFormDataSlice";
import { MESSAGE_KEY, MessageInputDataType } from "@/app/(auxiliary)/types/AppTypes/InputHooksTypes";
import { MessageType } from "@/app/(auxiliary)/types/Data/Interface/RootPage/RootPageContentType";
import { blue_light, red_dark } from "@/styles/colors";
import { FC, useEffect, useLayoutEffect, useRef, useState } from "react";
import styles from "./AudioPlayer.module.scss";
import { setNewNotification } from "@/app/(auxiliary)/libs/redux-toolkit/store/slices/AppSlice/AppSlice";
import { inputsNameError } from "../../inputsNameError";
import { boldSpanTag } from "@/app/(auxiliary)/func/tags/boldSpanTag";
import { span } from "framer-motion/client";

interface PropsType {
    voicePlaceholder?: MessageType;
    setNewMessage: (newMessage: File, validationStatus: boolean) => void;
    removeRecorder: () => void;
    isError: boolean;
    changeMessageTypeHandler: (newType: MessageInputDataType) => void;
    setErrorHandler: (status: boolean) => void;

}

const VoiceInput: FC<PropsType> = ({
    voicePlaceholder,
    setNewMessage,
    isError,
    setErrorHandler,
    changeMessageTypeHandler,
    removeRecorder
}) => {
    const dispatch = useAppDispatch()
    const voiceMessage = useAppSelector(selectFormFileData)[MESSAGE_KEY]
    const serverResponse = useAppSelector(selectServerResponse).status
    const rejectionInputs = useAppSelector(selectRejectionInputs)

    const [isRecording, setIsRecording] = useState(false)
    const [recordingIsDone, setRecordingIsDone] = useState<boolean>(voiceMessage.value instanceof File)
    const [microphonePermission, setMicrophonePermission] = useState<PermissionState>()
    const [noMicrophone, setNoMicrophone] = useState<boolean>(false)
    const [modalToAllowUseMicro, setModalToAllowUseMicro] = useState<boolean>(false)

    const [audioBlob, setAudioBlob] = useState<Blob | null>(() => {
        if (voiceMessage.value instanceof File) {
            return new Blob(
                [voiceMessage.value],
                { type: voiceMessage.value.type }
            )
        }

        return null
    })

    const mediaRecorderRef = useRef<MediaRecorder | null>(null)
    const audioChunksRef = useRef<Blob[]>([])
    const recordingButtonRef = useRef<HTMLButtonElement | null>(null)

    const startRecording = async () => {
        if (noMicrophone) {
            changeMessageTypeHandler("text")
            dispatch(setNewNotification({
                message: `К сожалению, мы не смогли получить доступ к вашему микрофону 😞<br/>${boldSpanTag("Опишите вашу проблему в текстовом блоке")} 📝`,
                "type": "warning"
            }))
            return
        }

        if (microphonePermission === "denied") {
            dispatch(setNewNotification({ message: `Вы запретили доступ к микрофону для нашего сайта 😞<br/> Но если Вы передумали, ${boldSpanTag("нажмите на значок замка 🔒 или значок настроек ⚙️ рядом с адресом сайта")} в строке браузера.<br/> Там вы сможете ${boldSpanTag("разрешить использование микрофона")}.`, type: "warning" }))
            return
        }

        setIsRecording((prevState) => !prevState)
        audioChunksRef.current = []

        setModalToAllowUseMicro(microphonePermission === "prompt")

        /**
         * Доступ к микрофону пользователя
         */
        const stream = await navigator.mediaDevices.getUserMedia({
            audio: true,
            video: false
        })

        /**
         * Реализация реагирования кнопки записи голосового сообщения на громкость звука
         * Создание аудио контекста и анализа аудио в реальном времени
         */
        const audioContext = new AudioContext()
        const source = audioContext.createMediaStreamSource(stream)
        const analyser = audioContext.createAnalyser() // Получение звука в реальном времени
        let recordingStatus = true

        /**
         * Определяет сглаживание данных частотного диапазона между вызовами метода getByteFrequencyData(). Значение ближе к 1 даст плавный переход, а к 0 - резкий.
         */
        analyser.smoothingTimeConstant = .3
        /**
         * Параметр задает размер Fast Fourier Transform (FFT), который используется для анализа частотной составляющей сигнала. Большее значение даст более точное значение о частотах.
         */
        analyser.fftSize = 1024
        const dataArray = new Uint8Array(analyser.frequencyBinCount)
        source.connect(analyser)
        // source.disconnect()

        const lerp = (start: number, end: number, t: number) => start + t * (end - start)
        let currentPosition = 100

        const analyzeVolume = () => {
            analyser.getByteFrequencyData(dataArray)

            const sum = dataArray.reduce((a, b) => a + b, 0)
            const averageVolume = (sum / dataArray.length) * 2 // Средний уровень громкости

            // Изменяем фон кнопки в зависимости от громкости (пример с градиентом)
            const intensity = Math.min(Math.max(averageVolume / 255, 0), 1) // Интенсивность от 0 до 1

            // const gradientPosition = lerp(currentPosition, 100 - intensity * 100, 0.1) // Процент градиента
            // currentPosition = gradientPosition

            // const gradientColor1 = `rgba(${lerp(38, 255, intensity)}, ${lerp(167, 50, intensity)}, ${lerp(227, 50, intensity)}, 1)`
            // const gradientColor2 = `rgba(${lerp(255, 255, 1 - intensity)}, ${lerp(255, 255, 1 - intensity)}, ${lerp(255, 255, 1 - intensity)}, 1)`

            // if (recordingButtonRef.current) {
            //     recordingButtonRef.current.style.background = `radial-gradient(circle, ${gradientColor1} 0%, ${gradientColor2} ${gradientPosition}%)`
            // }

            const gradientPosition = 100 - (intensity * 100) // Процент градиента

            if (recordingButtonRef.current) {
                // recordingButtonRef.current.style.transform = `scale(${newScale})`
                recordingButtonRef.current.style.background = `radial-gradient(circle, rgba(38,167,227,1) 0%, rgba(255,255,255, 1) ${gradientPosition}%)`
            }

            if (recordingStatus) {
                requestAnimationFrame(analyzeVolume)
            }
        }
        requestAnimationFrame(analyzeVolume)

        mediaRecorderRef.current = new MediaRecorder(stream)

        mediaRecorderRef.current.ondataavailable = (event) => {
            audioChunksRef.current.push(event.data)
        }

        mediaRecorderRef.current.onstop = () => {
            const blob = new Blob(audioChunksRef.current, { type: "audio/mp3" })

            if (blob) {
                setAudioBlob(blob)

                const newAudioFile = new File(
                    [blob],
                    `voice-record-${formattedTime()}`,
                    {
                        type: "audio/wav",
                        lastModified: Date.now()
                    }
                )
                setNewMessage(newAudioFile, true)
            }

            /**
             * Отключение всех дорожек и, соответственно, использование микрофона
             */
            stream.getTracks().forEach(track => track.stop());
            recordingStatus = false
            audioContext.close()
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
        removeRecorder()
        setRecordingIsDone(false)
        setAudioBlob(null)
    }

    useEffect(() => {
        if (serverResponse === "success") {
            setAudioBlob(null)
            setRecordingIsDone(false)
        }
    }, [
        serverResponse
    ]);

    useEffect(() => {
        if (!isError && rejectionInputs.length) {
            if (rejectionInputs.includes("message")) {
                dispatch(setNewNotification({
                    message: `${boldSpanTag(inputsNameError[MESSAGE_KEY])}: Сообщение не может быть пустым`,
                    type: "error"
                }))
                setErrorHandler(true)
            }
        }
    }, [rejectionInputs, isError, dispatch, setErrorHandler])

    useLayoutEffect(() => {
        /**
         * Checking, if user's devices has microphone and access to use it
         */
        setNoMicrophone(typeof navigator.mediaDevices?.getUserMedia !== "function")

        if (navigator.permissions) {
            navigator.permissions.query({ name: "microphone" as PermissionName }).then((permissions) => {
                // The permissions.state can be 'granted', 'denied', or 'prompt'
                // You can control the permission to use user's microphone
                setMicrophonePermission(permissions.state)

                permissions.onchange = () => {
                    setMicrophonePermission(permissions.state)

                    setModalToAllowUseMicro(false)
                }
            }).catch(() => {
                console.warn("Microphone permission query is not supported in this browser.")
            })
        } else {
            console.warn("Permissions API is not available in this browser")
        }
    }, []);

    useEffect(() => {
        if (modalToAllowUseMicro) {
            const timer = setTimeout(() => {
                setModalToAllowUseMicro(false)
            }, 3000)

            return () => {
                clearTimeout(timer)
            }
        }
    }, [modalToAllowUseMicro])

    return (
        <>
            <div className={styles.voiceInputWrapper}>
                {(audioBlob && recordingIsDone) ? (
                    <ReadyVoice audioBlob={audioBlob}
                        removeCurrentRecord={deleteCurrentRecord} />
                ) : (
                    <Button onClick={isRecording ? () => stopRecording() : () => startRecording()}
                        buttonRef={recordingButtonRef}
                        className={isRecording ? styles.recordingButton : ""}
                        style={{ backgroundColor: isError ? red_dark : blue_light }}
                        image={{
                            position: "left",
                            children: <Microphone />,
                            visibleOnlyImage: false
                        }}>
                        {isRecording ? voicePlaceholder?.recordingPlaceholder : voicePlaceholder?.inputPlaceholder}
                    </Button>
                )}
            </div>

            {modalToAllowUseMicro ? (
                <AllowToUseMicrophone isRecording={isRecording}
                    microphonePermission={microphonePermission}
                    stopRecording={stopRecording} />
            ) : null}
        </>
    )
};

export default VoiceInput;
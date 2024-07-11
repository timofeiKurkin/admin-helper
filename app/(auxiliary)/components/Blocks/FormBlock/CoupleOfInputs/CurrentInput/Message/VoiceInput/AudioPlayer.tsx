"use client"

import React, {FC, useEffect, useRef, useState} from 'react';
import {blue_dark, white_1} from "@/styles/colors";
import Play from "@/app/(auxiliary)/components/UI/SVG/Play/Play";
import Button from "@/app/(auxiliary)/components/UI/Button/Button";

interface PropsType {
    audioBlob: Blob;
}

const AudioPlayer: FC<PropsType> = ({audioBlob}) => {
    const [isPlaying, setIsPlaying] = useState<boolean>(false)
    const [progress, setProgress] = useState<number>(0)

    const audioContextRef = useRef<AudioContext | null>(null)
    const audioBufferRef = useRef<AudioBuffer | null>(null)

    const sourceRef = useRef<AudioBufferSourceNode | null>(null)
    const animationFrameRef = useRef<number | null>(null)

    const startTimeRef = useRef<number | null>(null)
    const stopTimeRef = useRef<number>(0)
    const progressBarRef = useRef<HTMLDivElement>(null)
    // const gainRef = useRef<GainNode | null>(null)

    useEffect(() => {
        const fetchData = async () => {
            if (audioBlob) {
                const arrayBuffer = await audioBlob.arrayBuffer()
                const audioContext = new window.AudioContext()

                audioContextRef.current = audioContext
                audioBufferRef.current = await audioContext.decodeAudioData(arrayBuffer)

                // gainRef.current = audioContext.createGain()
                // gainRef.current.gain.value = 1
            }
        }

        fetchData().then()
    }, [
        audioBlob
    ]);

    const startPlaying = () => {
        console.log("start")

        const audioContext = audioContextRef.current
        const audioBuffer = audioBufferRef.current

        if (audioContext && audioBuffer) {
            console.log("audioContext && audioBuffer && gainRef.current - true")

            sourceRef.current = audioContext.createBufferSource() // Создание нового аудио-источника
            sourceRef.current.buffer = audioBuffer // Привязка буфера к созданному источнику
            // sourceRef.current.connect(gainRef.current) // Подключение громкости
            sourceRef.current.connect(audioContext.destination) // Подключение источника к контексту для воспроизведения через устройства

            const startTime = audioContext.currentTime - stopTimeRef.current // Время старта аудиозаписи. Воспроизведение после паузы
            sourceRef.current.start(0, stopTimeRef.current) // Запуск источника
            startTimeRef.current = startTime // Сохранение времени старта

            console.log("startTime: ", startTime)
            console.log("sourceRef.current: ", sourceRef.current)
            console.log("audioContext.currentTime: ", audioContext.currentTime)
            console.log("stopTimeRef.current: ", stopTimeRef.current)
            console.log("")

            sourceRef.current.onended = () => { // Событие, когда воспроизведение источника завершено
                setIsPlaying(false)
                setProgress(100)
                if (animationFrameRef.current) {
                    cancelAnimationFrame(animationFrameRef.current)
                }
            }

            setIsPlaying(true)

            updateProgress(true) // Обновление прогресса воспроизведения
        }
    }

    const stopPlaying = () => {
        console.log("stop")

        if (sourceRef.current) {
            sourceRef.current?.stop() // Остановка воспроизведения
            if (audioContextRef.current && startTimeRef.current) { // Подсчет времени паузы
                stopTimeRef.current = audioContextRef.current.currentTime - startTimeRef.current
            }

            setIsPlaying(false)

            if (animationFrameRef.current) { // Отключение анимации
                cancelAnimationFrame(animationFrameRef.current)
            }
        }
    }

    const updateProgress = (status?: boolean) => {
        if (
            (isPlaying || status) &&
            sourceRef.current &&
            audioContextRef.current &&
            startTimeRef.current &&
            audioBufferRef.current
        ) {
            const currentTime = audioContextRef.current.currentTime - startTimeRef.current
            const duration = audioBufferRef.current.duration
            setProgress((currentTime / duration) * 100)

            console.log("update");
            console.log("currentTime: ", currentTime)
            console.log("duration: ", duration)
            console.log("progress: ", progress)
            console.log("")

            animationFrameRef.current = requestAnimationFrame(() => updateProgress(true))
        }
    }

    const handleProgressClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        if (progressBarRef.current && audioBufferRef.current) {
            const rect = progressBarRef.current.getBoundingClientRect() // Размеры для progressBarRef
            const offsetX = event.clientX - rect.left // Расстояние от левой границы полосы прогресса до точки, где произошел клик

            const newProgress = (offsetX / rect.width) * 100 // процентное значение, представляющее позицию клика относительно полной ширины полосы прогресса
            const newTime = (newProgress / 100) * audioBufferRef.current?.duration // Время для соответствующей позиции клика

            if (sourceRef.current) {
                sourceRef.current?.stop() // Остановка воспроизведения текущего сообщения
                stopTimeRef.current = newTime // Время паузы
                setProgress(newProgress) // Обновление прогресса
                startPlaying() // Начать воспроизведение с позиции, на которую нажали
            }
        }
    }

    return (
        <>
            <Button
                onClick={isPlaying ? stopPlaying : startPlaying}
                image={{
                    children: <Play/>,
                    visibleOnlyImage: true,
                }}/>

            <div ref={progressBarRef}
                 style={{
                     width: "100%",
                     height: "100%",
                     backgroundColor: white_1,
                     position: "relative",
                     cursor: "pointer",
                 }}
                 onClick={(e) => handleProgressClick(e)}
            >
                <div style={{
                    width: `${progress}%`,
                    height: '100%',
                    backgroundColor: blue_dark,
                    position: 'absolute',
                    top: 0,
                    left: 0
                }}></div>
            </div>
        </>
    );
};

export default AudioPlayer;
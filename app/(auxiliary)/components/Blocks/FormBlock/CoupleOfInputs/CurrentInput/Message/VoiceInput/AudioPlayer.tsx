"use client"

import React, {FC, useCallback, useEffect, useRef, useState} from 'react';
import Play from "@/app/(auxiliary)/components/UI/SVG/Play/Play";
import Button from "@/app/(auxiliary)/components/UI/Button/Button";
import AudioTrack from "@/app/(auxiliary)/components/UI/SVG/AudioTrack/AudioTrack";
import styles from "./AudioPlayer.module.scss";
import Pause from "@/app/(auxiliary)/components/UI/SVG/Pause/Pause";

interface PropsType {
    audioBlob: Blob;
}

const AudioPlayer: FC<PropsType> = ({audioBlob}) => {
    const [isPlaying, setIsPlaying] = useState<boolean>(false)
    const [isManualStop, setIsManualStop] = useState<boolean>(false)
    // const isPlayingRef = useRef<boolean>(isPlaying)

    const [progress, setProgress] = useState<number>(0)

    const audioContextRef = useRef<AudioContext | null>(null)
    const audioBufferRef = useRef<AudioBuffer | null>(null)

    const sourceRef = useRef<AudioBufferSourceNode | null>(null)
    const animationFrameRef = useRef<number | null>(null)

    const startTimeRef = useRef<number | null>(null)
    const stopTimeRef = useRef<number>(0)
    const progressBarRef = useRef<HTMLDivElement>(null)
    const gainRef = useRef<GainNode | null>(null)

    useEffect(() => {
        const fetchData = async () => {
            if (audioBlob) {
                const arrayBuffer = await audioBlob.arrayBuffer()
                const audioContext = new window.AudioContext()

                audioContextRef.current = audioContext
                audioBufferRef.current = await audioContext.decodeAudioData(arrayBuffer)

                gainRef.current = audioContext.createGain()
                gainRef.current.gain.value = 1
            }
        }

        fetchData().then()
    }, [
        audioBlob
    ]);

    const startPlaying = () => {
        const audioContext = audioContextRef.current
        const audioBuffer = audioBufferRef.current

        if (audioContext?.state === "suspended") {
            audioContext.resume().then()
        }

        if (audioContext && audioBuffer && gainRef.current) {
            sourceRef.current = audioContext.createBufferSource() // Создание нового аудио-источника
            sourceRef.current.buffer = audioBuffer // Привязка буфера к созданному источнику
            sourceRef.current.connect(gainRef.current) // Подключение громкости
            gainRef.current.connect(audioContext.destination) // Подключение источника к контексту для воспроизведения через устройства

            const startTime = audioContext.currentTime - stopTimeRef.current // Время старта аудиозаписи. Воспроизведение после паузы
            sourceRef.current.start(0, stopTimeRef.current) // Запуск источника
            startTimeRef.current = startTime // Сохранение времени старта

            sourceRef.current.onended = () => { // Событие, когда воспроизведение источника завершено
                setIsPlaying(false)
                if (!isManualStop) {
                    setProgress(100)
                    if (animationFrameRef.current) {
                        cancelAnimationFrame(animationFrameRef.current)
                    }
                } else {

                }
            }

            setIsPlaying(true)
            updateProgress(true) // Обновление прогресса воспроизведения
        }
    }

    const stopPlaying = () => {
        if (sourceRef.current && isPlaying) {
            setIsManualStop(true)

            sourceRef.current.stop() // Остановка воспроизведения
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
            setProgress(Number(((currentTime / duration) * 100).toFixed(1)))

            animationFrameRef.current = requestAnimationFrame(() => updateProgress(true))
        }
    }

    const handleProgressClick = (
        event: React.MouseEvent<HTMLDivElement, MouseEvent>
    ) => {
        if (progressBarRef.current && audioBufferRef.current) {
            const rect = progressBarRef.current.getBoundingClientRect() // Размеры для progressBarRef
            const offsetX = event.clientX - rect.left // Расстояние от левой границы полосы прогресса до точки, где произошел клик

            const newProgress = Number(((offsetX / rect.width) * 100).toFixed(1)) // процентное значение, представляющее позицию клика относительно полной ширины полосы прогресса
            const newTime = Number(((newProgress / 100) * audioBufferRef.current?.duration).toFixed(1)) // Время для соответствующей позиции клика

            if (sourceRef.current) {
                setIsManualStop(true)
                sourceRef.current?.stop() // Остановка воспроизведения текущего сообщения

                stopTimeRef.current = newTime // Время паузы
                setProgress(newProgress) // Обновление прогресса
                startPlaying() // Начать воспроизведение с позиции, на которую нажали
            }
        }
    }

    return (
        <>
            <Button onClick={isPlaying ? stopPlaying : startPlaying}
                    image={{
                        children: isPlaying ? <Pause/> : <Play/>,
                        visibleOnlyImage: true,
                    }}/>

            <div ref={progressBarRef}
                 className={styles.audioTrackWrapper}
                 onClick={(e) => handleProgressClick(e)}
            >

                <div className={styles.audioFill}
                     style={{
                         width: `${progress}%`,
                     }}></div>

                <div className={styles.audioTrack}>
                    <AudioTrack/>
                </div>
            </div>
        </>
    );
};

export default AudioPlayer;
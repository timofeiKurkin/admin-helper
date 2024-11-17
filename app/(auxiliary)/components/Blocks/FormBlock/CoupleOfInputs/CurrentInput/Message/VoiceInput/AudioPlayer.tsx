"use client"

import React, { FC, useEffect, useRef, useState } from 'react';
import Play from "@/app/(auxiliary)/components/UI/SVG/Play/Play";
import Button from "@/app/(auxiliary)/components/UI/Button/Button";
import AudioTrack from "@/app/(auxiliary)/components/UI/SVG/AudioTrack/AudioTrack";
import styles from "./AudioPlayer.module.scss";
import Pause from "@/app/(auxiliary)/components/UI/SVG/Pause/Pause";

interface PropsType {
    audioBlob: Blob;
}

const AudioPlayer: FC<PropsType> = ({ audioBlob }) => {
    const [isPlaying, setIsPlaying] = useState<boolean>(false)
    // const [isManualStop, setIsManualStop] = useState<boolean>(false)
    // const isPlayingRef = useRef<boolean>(isPlaying)

    const [progress, setProgress] = useState<number>(0)

    const audioContextRef = useRef<AudioContext | null>(null)
    const audioBufferRef = useRef<AudioBuffer | null>(null)

    const sourceRef =
        useRef<AudioBufferSourceNode | null>(null) // Ref, к которому привязывается аудио файл
    const gainRef = useRef<GainNode | null>(null) // Ref для подключения звука к файлу
    const animationFrameRef = useRef<number | null>(null)

    const startTimeRef = useRef<number>(0)
    const stopTimeRef = useRef<number>(0)

    const progressBarRef =
        useRef<HTMLDivElement>(null) // Линия прогресса прослушивания голосового сообщения

    const roundNumber = (num: number) => {
        return Number(num.toFixed(2))
    }

    /**
     * Загрузка аудио дорожки и звука.
     */
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

    useEffect(() => {
        return () => {
            if (sourceRef.current) {
                sourceRef.current.stop()
            }
        }
    }, []);

    /**
     * Функция, для воспроизведения голосового сообщения
     */
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

            /**
             * Время старта аудиозаписи. При первом прослушивании stopTimeRef.current = 0.
             */
            const startTime = roundNumber(audioContext.currentTime - stopTimeRef.current)

            sourceRef.current.start(0, stopTimeRef.current) // Запуск источника
            startTimeRef.current = startTime // Сохранение времени старта

            setIsPlaying(true)
            updateProgress(true) // Обновление прогресса полосы воспроизведения
        }
    }

    /**
     * Функция, которая ставит прослушивание голосового сообщения на паузу
     */
    const stopPlaying = () => {
        if (sourceRef.current && isPlaying) {
            // setIsManualStop(true)

            sourceRef.current.stop() // Остановка воспроизведения
            if (audioContextRef.current && startTimeRef.current) { // Подсчет времени паузы
                stopTimeRef.current = roundNumber(audioContextRef.current.currentTime - startTimeRef.current)
            }

            setIsPlaying(false)

            if (animationFrameRef.current) { // Отключение анимации
                cancelAnimationFrame(animationFrameRef.current)
            }
        }
    }

    /**
     * Функция для обновления линии прогресса аудиодорожки
     * @param status
     */
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
            const newProgress = roundNumber((currentTime / duration) * 100)
            setProgress(newProgress)

            if (Math.floor(newProgress) >= 99) {
                /**
                 * Событие, которое срабатывает, когда запись полностью воспроизведена
                 */
                sourceRef.current.onended = () => {
                    setProgress(100)
                    stopTimeRef.current = 0
                    startTimeRef.current = 0
                    setIsPlaying(false)

                    if (animationFrameRef.current) {
                        cancelAnimationFrame(animationFrameRef.current)
                    }
                }
            }

            animationFrameRef.current = requestAnimationFrame(() => updateProgress(true))
        }
    }

    const createSourceRef = () => {
        const audioContext = audioContextRef.current
        const audioBuffer = audioBufferRef.current

        if (audioContext?.state === "suspended") {
            audioContext.resume().then()
        }

        if (audioContext && gainRef.current) {
            sourceRef.current = audioContext.createBufferSource() // Создание нового аудио-источника
            sourceRef.current.buffer = audioBuffer // Привязка буфера к созданному источнику
            sourceRef.current.connect(gainRef.current) // Подключение громкости
            gainRef.current.connect(audioContext.destination) // Подключение источника к контексту для воспроизведения через устройства

            // return sourceRef
        }
    }

    /**
     * Функция для изменения прогресса прослушивания, после нажатия на полосу аудиодорожки
     * @param event
     */
    const handleProgressClick = (
        event: React.MouseEvent<HTMLDivElement, MouseEvent>
    ) => {
        if (progressBarRef.current && audioBufferRef.current) {
            // const audioContext = audioContextRef.current
            // const audioBuffer = audioBufferRef.current

            /**
             * Размеры для progressBarRef
             */
            const rect = progressBarRef.current.getBoundingClientRect()

            /**
             * Расстояние от левой границы полосы прогресса до точки, где произошел клик
             */
            const offsetX = event.clientX - rect.left

            /**
             * процентное значение, представляющее позицию клика относительно полной ширины полосы прогресса
             */
            const newProgress = roundNumber((offsetX / rect.width) * 100)
            /**
             * Время для соответствующей позиции клика
             */
            const newTime = roundNumber((newProgress / 100) * audioBufferRef.current?.duration)

            // if (!sourceRef.current) {
            //     createSourceRef() // Создание sourceRef.current, чтобы код ниже сработал
            // }

            if (sourceRef.current) {
                // setIsManualStop(true)
                if (isPlaying) {
                    sourceRef.current.stop() // Остановка воспроизведения текущего сообщения
                }

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
                    children: isPlaying ? <Pause /> : <Play />,
                    visibleOnlyImage: true,
                }} />

            <div ref={progressBarRef}
                className={styles.audioTrackWrapper}
            // onClick={(e) => handleProgressClick(e)}
            >
                <div className={styles.audioFill}
                    style={{
                        width: `${progress}%`,
                    }}></div>

                <div className={styles.audioTrack}>
                    <AudioTrack />
                </div>
            </div>
        </>
    );
};

export default AudioPlayer;
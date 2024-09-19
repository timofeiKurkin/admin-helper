import React, {FC, useEffect, useRef, useState} from 'react';
import {useAppDispatch, useAppSelector} from "@/app/(auxiliary)/libs/redux-toolkit/store/hooks";
import {
    changePreview,
    selectFormFileData
} from "@/app/(auxiliary)/libs/redux-toolkit/store/slices/UserFormDataSlice/UserFormDataSlice";
import {PhotoAndVideoKeysTypes, VIDEO_KEY} from "@/app/(auxiliary)/types/AppTypes/InputHooksTypes";
import styles from "./CreateVideoPreview.module.scss"

interface PropsType {
    type: PhotoAndVideoKeysTypes;
}

const CreatePreview: FC<PropsType> = ({children}) => {
    const dispatch = useAppDispatch()

    const formFileData = useAppSelector(selectFormFileData)[VIDEO_KEY]
    const [previews, setPreviews] =
        useState<File[]>(formFileData.filesFinally)

    const videoRef = useRef<HTMLVideoElement>(null)
    const canvasRef = useRef<HTMLCanvasElement>(null)


    useEffect(() => {
        const difference = formFileData.files.filter((file) => {
            return !previews.find((name) => name.name === file.name)
        })

        if (difference.length) {
            difference.forEach((file) => {
                if (!videoRef.current) {
                    return;
                }

                const videoURL = URL.createObjectURL(file)
                const videoElement = videoRef.current
                videoElement.src = videoURL

                const loadedMetaDataHandler = () => {
                    videoElement.currentTime = 0
                }

                const canPlayHandler = () => {
                    if (!canvasRef.current) {
                        return
                    }

                    const canvas = canvasRef.current
                    const ctx = canvas.getContext("2d")

                    if (!ctx) {
                        return;
                    }

                    canvas.width = videoElement.videoWidth
                    canvas.height = videoElement.videoHeight

                    ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height)

                    canvas.toBlob((blob) => {
                        if (blob) {
                            const newFile = new File([blob], file.name, {
                                type: "image/png",
                                lastModified: Date.now()
                            })

                            dispatch(changePreview({
                                key: VIDEO_KEY,
                                data: newFile
                            }))
                        }
                    }, "image/png", 1)
                }

                videoElement.addEventListener("loadedmetadata", loadedMetaDataHandler)
                videoElement.addEventListener("canplay", canPlayHandler)

                return () => {
                    URL.revokeObjectURL(videoURL)
                    videoElement.removeEventListener("loadedmetadata", loadedMetaDataHandler)
                    videoElement.removeEventListener("canplay", canPlayHandler)
                }
            })
        }
    }, [
        dispatch,
        formFileData.files,
        previews
    ]);

    return (
        <>
            {children}

            <div className={styles.createVideoPreview}>
                <video ref={videoRef}></video>
                <canvas ref={canvasRef}></canvas>
            </div>
        </>
    );
};

export default CreatePreview;
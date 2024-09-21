import React, {FC, useEffect, useRef, useState} from 'react';
import {useAppDispatch, useAppSelector} from "@/app/(auxiliary)/libs/redux-toolkit/store/hooks";
import {
    changePreview,
    selectFormFileData
} from "@/app/(auxiliary)/libs/redux-toolkit/store/slices/UserFormDataSlice/UserFormDataSlice";
import {PHOTO_KEY, PhotoAndVideoKeysTypes, VIDEO_KEY} from "@/app/(auxiliary)/types/AppTypes/InputHooksTypes";
import styles from "./CreateVideoPreview.module.scss"

interface PropsType {
    type: PhotoAndVideoKeysTypes;
    // changeVisibility: () => void;
    // children: React.ReactNode;
}

const CreatePreview: FC<PropsType> = ({
                                          type,
                                          // changeVisibility,
                                          // children
                                      }) => {
    const dispatch = useAppDispatch()

    const formFileData = useAppSelector(selectFormFileData)[type]
    const [previews, setPreviews] =
        useState<File[]>(formFileData.filesFinally)

    // const videoRef = useRef<HTMLVideoElement>(null)
    // const canvasRef = useRef<HTMLCanvasElement>(null)

    useEffect(() => {
        const difference = formFileData.files.filter((file) => {
            return !previews.find((name) => name.name === file.name)
        })

        if (difference.length) {
            if (type === VIDEO_KEY) {
                difference.forEach((file) => {
                    const videoRef = document.createElement("video")
                    const canvasRef = document.createElement("canvas")

                    const videoURL = URL.createObjectURL(file)
                    const videoElement = videoRef
                    videoElement.src = videoURL

                    const loadedMetaDataHandler = () => {
                        videoElement.currentTime = 0
                    }

                    const canPlayHandler = () => {
                        const canvas = canvasRef
                        const ctx = canvas.getContext("2d")

                        if (!ctx) {
                            return;
                        }

                        ctx.clearRect(0, 0, canvas.width, canvas.height)

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
                                    key: type,
                                    data: newFile
                                }))
                            }
                        }, "image/png", 1)

                        ctx.restore()
                    }

                    videoElement.addEventListener("loadedmetadata", loadedMetaDataHandler)
                    videoElement.addEventListener("canplay", canPlayHandler)

                    return () => {
                        URL.revokeObjectURL(videoURL)

                        videoElement.removeEventListener("loadedmetadata", loadedMetaDataHandler)
                        videoElement.removeEventListener("canplay", canPlayHandler)
                        videoElement.src = ""
                    }
                })
            } else if (type === PHOTO_KEY) {
                difference.forEach((file) => {
                    dispatch(changePreview({
                        key: type,
                        data: file
                    }))
                })
            }
        }

        console.log("create preview works")

        return () => {
            difference.length = 0
        }
    }, [
        dispatch,
        formFileData.files,
        previews,
        type
    ]);

    return null
};

export default CreatePreview;
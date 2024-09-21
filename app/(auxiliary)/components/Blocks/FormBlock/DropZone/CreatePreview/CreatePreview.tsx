import {FC, useEffect, useState} from 'react';
import {useAppDispatch, useAppSelector} from "@/app/(auxiliary)/libs/redux-toolkit/store/hooks";
import {
    changePreview,
    selectFormFileData
} from "@/app/(auxiliary)/libs/redux-toolkit/store/slices/UserFormDataSlice/UserFormDataSlice";
import {PHOTO_KEY, PhotoAndVideoKeysTypes, VIDEO_KEY} from "@/app/(auxiliary)/types/AppTypes/InputHooksTypes";

interface PropsType {
    type: PhotoAndVideoKeysTypes;
}

const CreatePreview: FC<PropsType> = ({
                                          type
                                      }) => {
    const dispatch = useAppDispatch()

    const formFileData = useAppSelector(selectFormFileData)[type]
    // const [previews, setPreviews] =
    //     useState<File[]>(formFileData.filesFinally)

    useEffect(() => {
        const newFiles = formFileData.files.filter((file) => {
            return !formFileData.filesFinally.find((name) => name.name === file.name)
        })

        if (newFiles.length) {
            if (type === VIDEO_KEY) {
                newFiles.forEach((file) => {
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
                newFiles.forEach((file) => {
                    dispatch(changePreview({
                        key: type,
                        data: file
                    }))
                })
            }
        }

        console.log("create preview works")

        return () => {
            newFiles.length = 0
        }
    }, [
        dispatch,
        formFileData.files,
        formFileData.filesFinally,
        type
    ]);

    return null
};

export default CreatePreview;
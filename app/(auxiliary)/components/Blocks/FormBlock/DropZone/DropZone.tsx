import React, {FC, useCallback, useEffect, useRef, useState} from "react";
import {FileListType} from "@/app/(auxiliary)/types/DropZoneTypes/DropZoneTypes";
import {FileError, useDropzone} from "react-dropzone";
import {PHOTO_KEY, PhotoAndVideoKeysTypes, VIDEO_KEY} from "@/app/(auxiliary)/types/AppTypes/InputHooksTypes";
import styles from "./DropZone.module.scss"
import Button from "@/app/(auxiliary)/components/UI/Button/Button";
import {ContentOfUploadBlockType} from "@/app/(auxiliary)/types/Data/Interface/RootPage/RootPageContentType";
import {white_1} from "@/styles/colors";
import Title from "@/app/(auxiliary)/components/UI/TextTemplates/Title";
import UploadFile from "@/app/(auxiliary)/components/UI/SVG/UploadFile/UploadFile";
import {formattedTime} from "@/app/(auxiliary)/func/formattedTime";
import {useAppDispatch, useAppSelector} from "@/app/(auxiliary)/libs/redux-toolkit/store/hooks";
import {
    addFileData,
    changePreview,
    selectFormFileData
} from "@/app/(auxiliary)/libs/redux-toolkit/store/slices/UserFormDataSlice/UserFormDataSlice";
import {
    changePhotoEditorVisibility,
    changePhotoSettings,
    changeVideoOrientation, changeVideoPlayerVisibility,
    setCurrentOpenedFileName
} from "@/app/(auxiliary)/libs/redux-toolkit/store/slices/PopupSlice/PopupSlice";
import {defaultPhotoSettings} from "@/app/(auxiliary)/types/PopupTypes/PopupTypes";
import {acceptSettings} from "@/app/(auxiliary)/components/Blocks/FormBlock/DropZone/possibleFileExtensions";
import {determineOrientation} from "@/app/(auxiliary)/func/editorHandlers";


interface PropsType {
    content: ContentOfUploadBlockType;
    inputType: PhotoAndVideoKeysTypes;
    visibleDragDropZone: () => void;
}

const DropZone: FC<PropsType> = ({
                                     content,
                                     inputType,
                                     visibleDragDropZone,
                                 }) => {
    const dispatch = useAppDispatch()
    const formFileData = useAppSelector(selectFormFileData)[inputType]

    const [uploadingFilesStatus, setUploadingFilesStatus] =
        useState<boolean>(false)

    const videoRef = useRef<HTMLVideoElement>(null)
    const canvasRef = useRef<HTMLCanvasElement>(null)

    const createPhotoPreviews = useCallback((newFiles: File[]) => {
        newFiles.forEach((file) => {
            dispatch(changePreview({
                key: inputType,
                data: file
            }))
        })
    }, [
        dispatch,
        inputType
    ])

    const createVideoPreviews = useCallback((newFiles: File[]) => {
        newFiles.forEach((file) => {
            const videoElement = document.createElement("video")
            const canvas = document.createElement("canvas")

            const videoURL = URL.createObjectURL(file)
            videoElement.src = videoURL

            const loadedMetaDataHandler = () => {
                videoElement.currentTime = 1
            }

            const canPlay = () => {
                const ctx = canvas.getContext("2d")

                if (!ctx) {
                    return;
                }

                ctx.clearRect(0, 0, canvas.width, canvas.height)

                const {videoWidth, videoHeight} = videoElement
                canvas.width = videoWidth
                canvas.height = videoHeight

                ctx.save()
                ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height)

                canvas.toBlob((blob) => {
                    console.log("blob is ahead the condition: ", blob)
                    if (blob) {
                        const newFile = new File([blob], file.name, {
                            type: "image/png",
                            lastModified: Date.now()
                        })

                        console.log("file for app state: ", newFile)

                        dispatch(changePreview({
                            key: inputType,
                            data: newFile
                        }))

                        dispatch(changeVideoOrientation({
                            name: file.name,
                            orientation: determineOrientation(videoWidth, videoHeight)
                        }))
                    }
                }, "image/png", 1)

                ctx.restore()
            }

            videoElement.onloadedmetadata = loadedMetaDataHandler

            videoElement.oncanplay = () => {
                if (videoElement.readyState >= 2) {
                    canPlay()
                }
            }

            return () => {
                URL.revokeObjectURL(videoURL)
                videoElement.src = ""
            }
        })
    }, [
        dispatch,
        inputType
    ])

    const onDrop = useCallback((userFiles: FileListType) => {
        if (inputType) {
            const filteredFiles =
                userFiles.filter((file) => !formFileData.files.includes(file))

            if (filteredFiles.length) {
                dispatch(addFileData({
                    key: inputType,
                    data: {
                        validationStatus: true,
                        value: filteredFiles
                    }
                }))
                dispatch(setCurrentOpenedFileName({
                    fileName: userFiles[0].name
                }))

                filteredFiles.forEach((file) => {
                    dispatch(changePhotoSettings({
                        ...defaultPhotoSettings,
                        name: file.name
                    }))
                })

                const newFiles = userFiles.filter((file) => {
                    return !formFileData.filesFinally.find((name) => name.name === file.name)
                })

                if (inputType === VIDEO_KEY) {
                    createVideoPreviews(newFiles)
                    visibleDragDropZone()
                    dispatch(changeVideoPlayerVisibility())
                } else if (inputType === PHOTO_KEY) {
                    createPhotoPreviews(newFiles)
                    visibleDragDropZone()
                    dispatch(changePhotoEditorVisibility())
                }

            }
        }

    }, [
        dispatch,
        inputType,
        formFileData.files,
        formFileData.filesFinally,

        visibleDragDropZone,

        createPhotoPreviews,
        createVideoPreviews
    ])

    const fileValidator = (
        file: File
    ): FileError | FileError[] | null | any => {
        if (formFileData.files.filter((f) => f.name === file.name).length) {
            return {}
        }

        return null
    }

    const {
        // fileRejections,
        getRootProps,
        getInputProps,
        isDragActive
    } = useDropzone({
        validator: fileValidator,
        onDrop,
        accept: acceptSettings[inputType],
        maxFiles: 10,
        disabled: uploadingFilesStatus
    })

    useEffect(() => {
        if (inputType === PHOTO_KEY) {
            const handleKeyDown = async () => {
                try {
                    const data = await navigator.clipboard.read()

                    if (data[0].types.includes("image/png")) {
                        const blobOutput = await data[0].getType("image/png")
                        const pastedImageName = `pasted-image-${formattedTime()}`
                        const newFile = new File([blobOutput], pastedImageName)

                        dispatch(addFileData({
                            key: inputType,
                            data: {
                                validationStatus: true,
                                value: [newFile] // If state is of files
                            }
                        }))
                        dispatch(changePhotoSettings({
                            ...defaultPhotoSettings,
                            name: newFile.name
                        }))
                        dispatch(setCurrentOpenedFileName({
                            fileName: newFile.name
                        }))
                        createPhotoPreviews([newFile])

                        visibleDragDropZone()
                        dispatch(changePhotoEditorVisibility())
                    }
                } catch (e) {
                    console.error("Error with paste a clipboard: ", e)
                }
            }

            window.addEventListener("paste", handleKeyDown)

            return () => {
                window.removeEventListener("paste", handleKeyDown)
            }
        }
    }, [
        createPhotoPreviews,
        dispatch,
        inputType,
        visibleDragDropZone
    ])

    return (
        <div className={styles.dropZoneWrapper}>

            <div className={styles.createVideoPreview}>
                <video ref={videoRef}></video>
                <canvas ref={canvasRef}></canvas>
            </div>

            <div {...getRootProps({
                style: {
                    width: "inherit",
                    height: "inherit",
                    userSelect: "none",
                    cursor: uploadingFilesStatus ? "default" : "pointer"
                }
            })}>
                <input {...getInputProps({})}
                       className={styles.dropInput}/>

                <div className={styles.dropZoneContentWrapper}>
                    <div className={styles.dropZoneContent}>
                        <UploadFile animationStatus={isDragActive}/>

                        {
                            isDragActive ? (
                                <div className={styles.dropZoneText}>
                                    <Title>{content.isDragContent}</Title>
                                </div>
                            ) : (
                                <>
                                    <div className={styles.dropZoneText}>
                                        <Title>{inputType === "photo" ? content.uploadPhoto : content.uploadVideo}</Title>
                                    </div>

                                    <div className={styles.closeDropZone}
                                         onClick={(e) => e.stopPropagation()}>
                                        <Button onClick={visibleDragDropZone}
                                                style={{
                                                    backgroundColor: white_1
                                                }}>{content.button}</Button>
                                    </div>
                                </>
                            )
                        }
                    </div>
                </div>
            </div>
        </div>

    );
};

export default DropZone;
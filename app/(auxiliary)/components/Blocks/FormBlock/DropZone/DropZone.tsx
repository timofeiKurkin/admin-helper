import React, {FC, useCallback, useEffect} from "react";
import {FileListType} from "@/app/(auxiliary)/types/DropZoneTypes/DropZoneTypes";
import {FileError, useDropzone} from "react-dropzone";
import {PHOTO_KEY, PhotoAndVideoKeysTypes, VIDEO_KEY} from "@/app/(auxiliary)/types/AppTypes/InputHooksTypes";
import {useAppDispatch, useAppSelector} from "@/app/(auxiliary)/libs/redux-toolkit/store/hooks";
import {
    addFileData,
    changePreview,
    selectFormFileData
} from "@/app/(auxiliary)/libs/redux-toolkit/store/slices/UserFormDataSlice/UserFormDataSlice";
import {
    changePhotoSettings,
    changePopupVisibility,
    changeVideoOrientation,
    setCurrentOpenedFileName
} from "@/app/(auxiliary)/libs/redux-toolkit/store/slices/PopupSlice/PopupSlice";
import {defaultPhotoSettings} from "@/app/(auxiliary)/types/PopupTypes/PopupTypes";
import {acceptSettings} from "@/app/(auxiliary)/components/Blocks/FormBlock/DropZone/possibleFileExtensions";
import {determineOrientation} from "@/app/(auxiliary)/func/editorHandlers";
import {selectUserDevice} from "@/app/(auxiliary)/libs/redux-toolkit/store/slices/AppSlice/AppSlice";
import MobileDropZone from "@/app/(auxiliary)/components/Blocks/FormBlock/DropZone/MobileDropZone/MobileDropZone";
import DesktopDropZone from "@/app/(auxiliary)/components/Blocks/FormBlock/DropZone/DesktopDropZone/DesktopDropZone";
import {Simulate} from "react-dom/test-utils";
import drag = Simulate.drag;


interface PropsType {
    inputType: PhotoAndVideoKeysTypes;
    visibleDragDropZone: () => void;
    dragDropZoneIsOpen: boolean;
}

const DropZone: FC<PropsType> = ({
                                     inputType,
                                     visibleDragDropZone,
                                     dragDropZoneIsOpen
                                 }) => {
    const dispatch = useAppDispatch()
    const formFileData = useAppSelector(selectFormFileData)[inputType]
    const userDevice = useAppSelector(selectUserDevice)

    const createPhotoPreviews = useCallback((newFiles: File[]) => {
        dispatch(changePreview({
            key: inputType,
            data: newFiles
        }))
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
                    if (blob) {
                        const newFile = new File([blob], file.name, {
                            type: "image/png",
                            lastModified: Date.now()
                        })

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
            const filteredFiles = userFiles.filter((file) => !formFileData.files.includes(file))

            if (filteredFiles.length) {
                dispatch(addFileData({
                    key: inputType,
                    data: {
                        validationStatus: true,
                        value: filteredFiles
                    }
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
                } else if (inputType === PHOTO_KEY) {
                    createPhotoPreviews(newFiles)
                }

                visibleDragDropZone()

                if (!userDevice.phoneAdaptive) {
                    dispatch(changePopupVisibility({type: inputType}))
                    dispatch(setCurrentOpenedFileName({
                        fileName: userFiles[0].name
                    }))
                }
            }
        }
    }, [
        dispatch,
        inputType,
        formFileData.files,
        formFileData.filesFinally,

        visibleDragDropZone,
        userDevice.phoneAdaptive,

        createPhotoPreviews,
        createVideoPreviews
    ])

    const fileValidator = (
        file: File
    ): FileError | FileError[] | null | any => {
        if (formFileData.files.filter((prevFile) => prevFile.name === file.name).length) {
            return {}
        }

        return null
    }

    const {
        getRootProps,
        getInputProps,
        isDragActive,
        inputRef
    } = useDropzone({
        validator: fileValidator,
        onDrop,
        accept: acceptSettings[inputType],
        maxFiles: 8
    })

    if (userDevice.phoneAdaptive) {
        return <MobileDropZone getInputProps={getInputProps}
                               dragDropZoneIsOpen={dragDropZoneIsOpen}
                               inputRef={inputRef}/>
    } else {
        return <DesktopDropZone inputProps={{getInputProps, getRootProps}}
                                type={inputType}
                                isDragActive={isDragActive}
                                visibleDragDropZone={visibleDragDropZone}
                                createPhotoPreviews={createPhotoPreviews}/>
    }
};

export default DropZone;
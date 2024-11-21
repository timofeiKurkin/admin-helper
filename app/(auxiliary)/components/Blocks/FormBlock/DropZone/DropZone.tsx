import DesktopDropZone from "@/app/(auxiliary)/components/Blocks/FormBlock/DropZone/DesktopDropZone/DesktopDropZone";
import MobileDropZone from "@/app/(auxiliary)/components/Blocks/FormBlock/DropZone/MobileDropZone/MobileDropZone";
import { acceptSettings, maxFiles, maxSize } from "@/app/(auxiliary)/components/Blocks/FormBlock/DropZone/possibleFileExtensions";
import { determineOrientation } from "@/app/(auxiliary)/func/editorHandlers";
import { useAppDispatch, useAppSelector } from "@/app/(auxiliary)/libs/redux-toolkit/store/hooks";
import { selectUserDevice, setNewNotification } from "@/app/(auxiliary)/libs/redux-toolkit/store/slices/AppSlice/AppSlice";
import {
    changePhotoSettings,
    changePopupVisibility,
    changeVideoOrientation,
    setCurrentOpenedFileName
} from "@/app/(auxiliary)/libs/redux-toolkit/store/slices/PopupSlice/PopupSlice";
import {
    addFileData,
    changePreview,
    selectFormFileData
} from "@/app/(auxiliary)/libs/redux-toolkit/store/slices/UserFormDataSlice/UserFormDataSlice";
import { PHOTO_KEY, PhotoAndVideoKeysType, VIDEO_KEY } from "@/app/(auxiliary)/types/AppTypes/InputHooksTypes";
import { FileListType } from "@/app/(auxiliary)/types/FormTypes/DropZoneTypes/DropZoneTypes";
import { defaultPhotoSettings } from "@/app/(auxiliary)/types/FormTypes/PopupTypes/PopupTypes";
import { FC, useCallback, useEffect } from "react";
import { ErrorCode, FileError, useDropzone } from "react-dropzone";
import PopupDisableScroll from "../../../Common/Popups/PopupsWrapper/PopupDisableScroll/PopupDisableScroll";
import OpacityAnimation from "../../../UI/Animations/OpacityAnimation/OpacityAnimation";
import styles from "./DropZone.module.scss";


const availableVideoFormats = ["mp4", "webm"]


interface PropsType {
    inputType: PhotoAndVideoKeysType;
    openDragDropZone: () => void;
    dragDropZoneIsOpen: boolean;
}

const DropZone: FC<PropsType> = ({
    inputType,
    openDragDropZone,
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
        newFiles.forEach((file, index) => {
            const videoFormat = file.name.split(".").pop()!
            console.log(videoFormat)

            if (!availableVideoFormats.includes(videoFormat)) {
                dispatch(changePreview({
                    key: inputType,
                    data: {} as File
                }))
                dispatch(changeVideoOrientation({
                    name: file.name,
                    orientation: "horizontal"
                }))
                return
            }

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

                const { videoWidth, videoHeight } = videoElement
                canvas.width = videoWidth
                canvas.height = videoHeight

                ctx.save()
                ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height)

                canvas.toBlob((blob) => {
                    if (blob) {
                        const newFile = Object.assign(new File([blob], file.name, {
                            type: "image/png",
                            lastModified: Date.now()
                        }), { id: index })

                        // Previews save in filedata.filesFinally array
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

                dispatch(setNewNotification({ message: "Файлы успешно добавлены!", type: "success" }))
                openDragDropZone()

                if (!userDevice.phoneAdaptive) {
                    dispatch(changePopupVisibility({ type: inputType }))
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

        openDragDropZone,
        userDevice.phoneAdaptive,

        createPhotoPreviews,
        createVideoPreviews
    ])

    const fileValidator = (
        file: File
    ): FileError | FileError[] | null | any => {
        const repeatedElement = formFileData.files.findIndex((prevFile) => prevFile.name === file.name)

        if (repeatedElement !== -1) {
            return {
                code: "file-exists",
                message: `Файл ${file.name} уже добавлен!`
            }
        }

        return null
    }

    const {
        getRootProps,
        getInputProps,
        isDragActive,
        inputRef,
        fileRejections
    } = useDropzone({
        validator: fileValidator,
        onDrop,
        accept: acceptSettings[inputType],
        maxFiles: maxFiles[inputType],
        maxSize: maxSize[inputType]
    })

    useEffect(() => {
        fileRejections.forEach((item) => {
            item.errors.forEach((error) => {
                if (Object.values(ErrorCode).includes(error.code as ErrorCode)) {
                    if (error.code === "too-many-files") {
                        const type = `${inputType === PHOTO_KEY ? "фотографий" : "видео"}`
                        dispatch(setNewNotification({ message: `Вы не можете загрузить больше <b>${maxFiles[inputType]}</b> ${type}`, type: "error" }))
                    } else if (error.code === "file-too-large") {
                        const type = `${inputType === PHOTO_KEY ? "фотографии" : "видео"}`
                        dispatch(setNewNotification({ message: `Размер ${type} не должен превышать <b>${maxSize[inputType]}МБ</b>`, type: "error" }))
                    }
                } else {
                    dispatch(setNewNotification({ message: error.message, type: "error" }))
                }
            })
        })
    }, [
        fileRejections,
        dispatch,
        inputType
    ])


    if (userDevice.phoneAdaptive) {
        return (
            <OpacityAnimation trigger={userDevice.phoneAdaptive}>
                <MobileDropZone getInputProps={getInputProps}
                    dragDropZoneIsOpen={dragDropZoneIsOpen}
                    inputRef={inputRef} />
            </OpacityAnimation>
        )
    } else {
        return (
            <PopupDisableScroll>
                <div className={styles.dropZoneWrapper}>
                    <OpacityAnimation trigger={!userDevice.phoneAdaptive}>
                        <DesktopDropZone inputProps={{ getInputProps, getRootProps }}
                            type={inputType}
                            isDragActive={isDragActive}
                            openDragDropZone={openDragDropZone}
                            createPhotoPreviews={createPhotoPreviews} />
                    </OpacityAnimation>

                </div>
            </PopupDisableScroll>
        )
    }
};

export default DropZone;
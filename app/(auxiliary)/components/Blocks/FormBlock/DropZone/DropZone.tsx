import React, {FC, useCallback, useEffect, useState} from "react";
import {FilesListType} from "@/app/(auxiliary)/types/DropZoneTypes/DropZoneTypes";
import {FileError, useDropzone} from "react-dropzone";
import {PhotoAndVideoKeysTypes} from "@/app/(auxiliary)/types/AppTypes/InputHooksTypes";
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
    selectFormFileData
} from "@/app/(auxiliary)/libs/redux-toolkit/store/slices/UserFormDataSlice/UserFormDataSlice";
import {
    changeEditorVisibility,
    changePhotoSettings,
    setCurrentOpenedFileName
} from "@/app/(auxiliary)/libs/redux-toolkit/store/slices/PhotoEditorSlice/PhotoEditorSlice";
import {defaultPhotoSettings} from "@/app/(auxiliary)/types/PhotoEditorTypes/PhotoEditorTypes";


interface PropsType {
    content: ContentOfUploadBlockType;
    inputType: PhotoAndVideoKeysTypes;
    visibleDragDropZone: () => void;
    // openPhotoEditor: () => void;
}

const DropZone: FC<PropsType> = ({
                                     content,
                                     inputType,
                                     visibleDragDropZone,
                                     // openPhotoEditor
                                 }) => {
    const dispatch = useAppDispatch()
    const formFileData = useAppSelector(selectFormFileData)

    const [uploadingFilesStatus, setUploadingFilesStatus] =
        useState<boolean>(false)

    const onDrop = useCallback((userFiles: FilesListType) => {
        const filteredFiles =
            userFiles.filter((file) => !formFileData[inputType].files.includes(file))

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

            visibleDragDropZone()
            dispatch(changeEditorVisibility())
        }

    }, [
        dispatch,
        formFileData,
        // openPhotoEditor,
        visibleDragDropZone,
        inputType,
    ])

    const nonRepeatingFiles = (
        file: File
    ): FileError | FileError[] | null | any => {

        if (formFileData[inputType].files.filter((f) => f.name === file.name).length) {
            return {}
        }

        return null
    }

    const acceptSettings: { [key: string]: { [accept: string]: string[] } } = {
        "video": {
            "video/*": [
                ".mp4", ".mkv", ".webm", ".avi", ".mov", ".wmv", ".flv", ".m4v", ".mpg", ".mpeg", ".3gp"
            ]
        },
        "photo": {
            "image/*": [
                ".jpg", ".jpeg", ".png", ".gif", ".bmp", ".tiff", ".ico", ".webp", ".svg"
            ]
        }
    }

    const {
        // fileRejections,
        getRootProps,
        getInputProps,
        isDragActive
    } = useDropzone({
        validator: nonRepeatingFiles,
        onDrop,
        accept: acceptSettings[inputType],
        maxFiles: 10,
        disabled: uploadingFilesStatus
    })

    useEffect(() => {
        const handleKeyDown = async () => {
            try {
                const data = await navigator.clipboard.read()
                console.log("data", data)

                if (data[0].types.includes("image/png")) {
                    const blobOutput = await data[0].getType("image/png")
                    const pastedImageName = `pasted-image-${formattedTime()}`
                    const newFile = new File([blobOutput], pastedImageName)
                    // const newFileURL = URL.createObjectURL(newFile)

                    dispatch(addFileData({
                        key: inputType,
                        data: {
                            validationStatus: true,
                            value: [newFile] // If state is of files
                            // value: [{ // If state is of urls
                            //     name: pastedImageName,
                            //     url: newFileURL
                            // }]
                        }
                    }))
                    visibleDragDropZone()
                }
            } catch (e) {
                console.error("Error with paste a clipboard: ", e)
            }
        }

        window.addEventListener("paste", handleKeyDown)

        return () => {
            window.removeEventListener("paste", handleKeyDown)
        }
    }, [
        dispatch,
        inputType,
        visibleDragDropZone
    ])

    // useEffect(() => {
    //     const test = bufferRef.current
    //     test?.focus()
    //
    //     const pasteHandler = (e: any) => {
    //         console.log("navigator content", navigator)
    //         console.log("press paste", e)
    //     }
    //
    //     test?.addEventListener("paste", pasteHandler)
    //
    //
    //     return () => {
    //         test?.removeEventListener("paste", pasteHandler)
    //     }
    // }, []);

    // const pasteHandler = async (e: any) => {
    //     const data = await navigator.clipboard.read()
    //     console.log("navigator content", data)
    //     console.log("press paste", e)
    // }

    return (
        <div className={styles.dropZoneWrapper}
            // ref={bufferRef}
            // onPaste={pasteHandler}
        >
            <div {...getRootProps({
                style: {
                    width: "inherit",
                    height: "inherit",
                    userSelect: "none",
                    cursor: uploadingFilesStatus ? "default" : "pointer"
                },
                // onPaste: (e) => pasteHandler(e)
            })}>
                <input {...getInputProps({})}
                    // onPaste={(e) => pasteHandler(e)}
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
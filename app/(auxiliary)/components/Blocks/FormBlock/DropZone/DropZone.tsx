import React, {FC, useCallback, useContext, useEffect, useState} from "react";
import {FileListType} from "@/app/(auxiliary)/types/DropZoneTypes/DropZoneTypes";
import {FileError, useDropzone} from "react-dropzone";
import {PhotoAndVideoInputType} from "@/app/(auxiliary)/types/AppTypes/InputHooksTypes";
import styles from "./DropZone.module.scss"
import Button from "@/app/(auxiliary)/components/UI/Button/Button";
import {UploadFileType} from "@/app/(auxiliary)/types/Data/Interface/RootPage/RootPageType";
import {white_1} from "@/styles/colors";
import Title from "@/app/(auxiliary)/components/UI/TextTemplates/Title";
import {AppContext} from "@/app/(auxiliary)/components/Common/Provider/Provider";
import UploadFile from "@/app/(auxiliary)/components/UI/SVG/UploadFile/UploadFile";
import {formattedTime} from "@/app/(auxiliary)/func/formattedTime";


interface PropsType {
    content: UploadFileType;
    filesType: PhotoAndVideoInputType;
    visibleDragDropZone: () => void;
}

const DropZone: FC<PropsType> = ({
                                     content,
                                     filesType,
                                     visibleDragDropZone
                                 }) => {
    const {appState, setAppState} = useContext(AppContext)
    const [uploadingFilesStatus, setUploadingFilesStatus] =
        useState<boolean>(false)

    const onDrop = useCallback((userFiles: FileListType) => {
        if (appState.userFormData?.file_data) {
            const currentFiles = appState.userFormData?.file_data[filesType]?.files
            const filteredFiles =
                userFiles.filter((file) => !currentFiles?.includes(file))

            if (filteredFiles) {
                setAppState((prevState) => {
                    if (!prevState.userFormData?.file_data) {
                        return prevState
                    }

                    return {
                        ...prevState,
                        userFormData: {
                            ...prevState.userFormData,
                            file_data: {
                                ...prevState.userFormData?.file_data,
                                [filesType]: {
                                    ...prevState.userFormData?.file_data[filesType],
                                    files: [
                                        ...prevState.userFormData?.file_data[filesType]?.files || [],
                                        ...filteredFiles
                                    ]
                                }
                            }
                        }
                    }
                })
            }
        }

        visibleDragDropZone()
    }, [
        visibleDragDropZone,
        filesType,
        appState,
        setAppState
    ])

    const nonRepeatingFiles = (
        file: File
    ): FileError | FileError[] | null | any => {

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
        fileRejections,
        getRootProps,
        getInputProps,
        isDragActive
    } = useDropzone({
        validator: nonRepeatingFiles,
        onDrop,
        accept: acceptSettings[filesType],
        maxFiles: 10,
        disabled: uploadingFilesStatus
    })

    useEffect(() => {
        const handleKeyDown = async () => {
            try {
                const data = await navigator.clipboard.read()
                console.log("data", data)

                if (data[0].types.includes("image/png") && appState.userFormData?.file_data) {
                    const blobOutput = await data[0].getType("image/png")
                    const pastedImageName = `pasted-image-${formattedTime()}`
                    const newFile = new File([blobOutput], pastedImageName)

                    setAppState({
                        ...appState,
                        userFormData: {
                            ...appState.userFormData,
                            file_data: {
                                ...appState.userFormData?.file_data,
                                [filesType]: {
                                    ...appState.userFormData?.file_data[filesType],
                                    files: [
                                        ...appState.userFormData?.file_data[filesType]?.files || [],
                                        newFile
                                    ]
                                }
                            }
                        }
                    })
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
    }, [])

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
                                        <Title>{filesType === "photo" ? content.uploadPhoto : content.uploadVideo}</Title>
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
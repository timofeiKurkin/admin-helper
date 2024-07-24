import React, {FC, useCallback, useContext, useEffect, useRef, useState} from "react";
import {FileListType} from "@/app/(auxiliary)/types/DropZoneTypes/DropZoneTypes";
import {FileError, useDropzone} from "react-dropzone";
import {PhotoAndVideoInputType} from "@/app/(auxiliary)/types/AppTypes/InputHooksTypes";
import styles from "./DropZone.module.scss"
import Button from "@/app/(auxiliary)/components/UI/Button/Button";
import {UploadFileType} from "@/app/(auxiliary)/types/Data/Interface/RootPage/RootPageType";
import {white_1} from "@/styles/colors";
import Title from "@/app/(auxiliary)/components/UI/TextTemplates/Title";
import {AppContext} from "@/app/(auxiliary)/components/Common/Provider/Provider";
import {KeyBoardEventHandler} from "@/app/(auxiliary)/types/AppTypes/AppTypes";
import Image from "next/image";


interface PropsType {
    content: UploadFileType;
    filesType: PhotoAndVideoInputType;
    openDragDropZone: () => void;
}

const DropZone: FC<PropsType> = ({
                                     content,
                                     filesType,
                                     openDragDropZone
                                 }) => {
    const {appState, setAppState} = useContext(AppContext)
    const [uploadingFilesStatus, setUploadingFilesStatus] =
        useState<boolean>(false)
    const [imageData, setImageData] = useState<string>("")

    const onDrop = useCallback((userFiles: FileListType) => {
        console.log("userFiles", userFiles)

        if (appState.photoList) {
            const filteredFiles =
                userFiles.filter((file) => !appState.photoList?.files?.includes(file))

            if (filteredFiles) {
                if (filesType === "video") {
                    setAppState({
                        ...appState,
                        videoList: {
                            ...appState.videoList,
                            files: [
                                ...appState.videoList?.files || [],
                                ...filteredFiles
                            ]
                        }
                    })
                } else if (filesType === "photo") {
                    setAppState({
                        ...appState,
                        photoList: {
                            ...appState.photoList,
                            files: [
                                ...appState.photoList.files,
                                ...filteredFiles
                            ]
                        }
                    })
                }
            }
        }


    }, [
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
            const data = await navigator.clipboard.read()
            const blobOutput = await data[0].getType("image/png")
            const dataURL = URL.createObjectURL(blobOutput)
            setImageData(dataURL)
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
                        <div className={styles.dropZoneText}>
                            <Title>{filesType === "photo" ? content.uploadPhoto : content.uploadVideo}</Title>
                        </div>

                        <div className={styles.closeDropZone}
                             onClick={(e) => e.stopPropagation()}>
                            <Button onClick={openDragDropZone}
                                    style={{
                                        backgroundColor: white_1
                                    }}>{content.button}</Button>

                            {imageData ? (
                                <Image src={imageData}
                                       alt={"photo from clipboard"}
                                       width={100}
                                       height={100}/>
                            ): null}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DropZone;
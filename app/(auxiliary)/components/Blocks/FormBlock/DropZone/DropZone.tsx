import React, {FC, useCallback, useContext, useState} from "react";
import {FileListType} from "@/app/(auxiliary)/types/DropZoneTypes/DropZoneTypes";
import {FileError, useDropzone} from "react-dropzone";
import {PhotoAndVideoInputType} from "@/app/(auxiliary)/types/AppTypes/InputHooksTypes";
import styles from "./DropZone.module.scss"
import ButtonText from "@/app/(auxiliary)/components/UI/TextTemplates/ButtonText";
import Button from "@/app/(auxiliary)/components/UI/Button/Button";
import {UploadFileType} from "@/app/(auxiliary)/types/Data/Interface/RootPage/RootPageType";
import {blue_dark, white_1} from "@/styles/colors";
import Title from "@/app/(auxiliary)/components/UI/TextTemplates/Title";
import {AppContext} from "@/app/(auxiliary)/components/Common/Provider/Provider";


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
    // const [filesList, setFilesList] = useState<FileListType>([])

    const {appState, setAppState} = useContext(AppContext)
    const [uploadingFilesStatus, setUploadingFilesStatus] =
        useState<boolean>(false)

    const onDrop = useCallback((userFiles: FileListType) => {
        console.log("userFiles", userFiles)
        console.log("appState.photoList", appState.photoList)

        if(appState.photoList) {
            const filteredFiles = userFiles.filter((file) => !appState.photoList?.includes(file))
            console.log("filteredFiles", filteredFiles)

            if (filteredFiles) {
                setAppState({
                    ...appState,
                    photoList: [
                        ...appState.photoList,
                        ...filteredFiles.map((file) =>
                            Object.assign(file, {preview: URL.createObjectURL(file)}))
                    ]
                })

                // setFilesList(() => [
                //     ...filesList,
                //     ...filteredFiles.map((file) =>
                //         Object.assign(file, {preview: URL.createObjectURL(file)}))
                // ])
            }
        }


    }, [appState, setAppState])

    const nonRepeatingFiles = <T extends File>(file: T): FileError | FileError[] | null | any => {

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

    return (
        <div className={styles.dropZoneWrapper}>
            <div {...getRootProps({
                style: {
                    width: "inherit",
                    height: "inherit",
                    userSelect: "none",
                    cursor: uploadingFilesStatus ? "default" : "pointer"
                }
            })}>
                <input {...getInputProps({})}
                       className={styles.dropInput}
                       onClick={(e) => e.stopPropagation()}/>

                <div className={styles.dropZoneContentWrapper}>
                    <div className={styles.dropZoneContent}>
                        <div className={styles.dropZoneText}>
                            <Title>{filesType === "photo" ? content.uploadPhoto : content.uploadVideo}</Title>
                        </div>

                        <div className={styles.closeDropZone}>
                            <Button onClick={openDragDropZone}
                                    style={{
                                        backgroundColor: white_1
                                    }}>{content.button}</Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DropZone;
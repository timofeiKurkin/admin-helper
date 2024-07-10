import React, {FC, useCallback, useState} from "react";
import {FileListType} from "@/app/(auxiliary)/types/DropZoneTypes/DropZoneTypes";
import {FileError, useDropzone} from "react-dropzone";
import {PhotoAndVideoInputType} from "@/app/(auxiliary)/types/AppTypes/InputHooksTypes";
import styles from "./DropZone.module.scss"
import ButtonText from "@/app/(auxiliary)/components/UI/TextTemplates/ButtonText";


interface PropsType {
    dropZoneType: PhotoAndVideoInputType
    dropZonePlaceholder?: string;
}

const DropZone: FC<PropsType> = ({
                                     dropZonePlaceholder = "",
                                     dropZoneType
                                 }) => {
    const [filesList, setFilesList] =
        useState<FileListType>([])
    const [uploadingFilesStatus, setUploadingFilesStatus] =
        useState<boolean>(false)

    const onDrop = useCallback((userFiles: FileListType) => {
        const filteredFiles = userFiles.filter((file) => !filesList.includes(file))

        if (filteredFiles) {
            setFilesList(() => [
                ...filesList,
                ...filteredFiles
            ])
        }
    }, [filesList])

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
        accept: acceptSettings[dropZoneType],
        maxFiles: 10,
        disabled: uploadingFilesStatus
    })

    return (
        <>

            <div className={styles.dropZone}>
                <div {...getRootProps({
                    style: {
                        userSelect: "none",
                        cursor: uploadingFilesStatus ? "default" : "pointer"
                    }
                })}
                     className={styles.dropZoneWrapper}>
                    <input {...getInputProps({placeholder: dropZonePlaceholder})}
                           className={styles.dropInput}/>

                    <div className={styles.dropTextContent}>
                        <ButtonText>
                            {dropZonePlaceholder}
                        </ButtonText>
                    </div>
                </div>
            </div>
        </>
    );
};

export default DropZone;
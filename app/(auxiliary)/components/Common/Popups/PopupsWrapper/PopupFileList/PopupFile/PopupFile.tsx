import React, {FC} from 'react';
import Text from "@/app/(auxiliary)/components/UI/TextTemplates/Text";
import FilePreviewBlock from "@/app/(auxiliary)/components/Blocks/FilePreviewBlock/FilePreviewBlock";
import {trimLongTitle} from "@/app/(auxiliary)/func/trimLongTitle";
import Trash from "@/app/(auxiliary)/components/UI/SVG/Trash/Trash";
import {useAppDispatch, useAppSelector} from "@/app/(auxiliary)/libs/redux-toolkit/store/hooks";
import {
    selectOpenedFileName,
    setCurrentOpenedFileName
} from "@/app/(auxiliary)/libs/redux-toolkit/store/slices/PopupSlice/PopupSlice";
import {
    deleteFile,
    selectFormFileData
} from "@/app/(auxiliary)/libs/redux-toolkit/store/slices/UserFormDataSlice/UserFormDataSlice";
import styles from "./PopupFile.module.scss";
import {PhotoAndVideoKeysTypes} from "@/app/(auxiliary)/types/AppTypes/InputHooksTypes";


interface PropsType {
    index: number;
    file: File;
    switchToAnotherFile: (fileName: string) => void;
    type: PhotoAndVideoKeysTypes;
}

const PopupFile: FC<PropsType> = ({
                                       index,
                                       file,
                                       switchToAnotherFile,
                                       type
                                   }) => {

    const dispatch = useAppDispatch()
    const currentFileName = useAppSelector(selectOpenedFileName)
    const filesNames = useAppSelector(selectFormFileData)[type].filesNames

    const chooseAnotherFile = (fileName: string) => {
        dispatch(setCurrentOpenedFileName({fileName}))
        switchToAnotherFile(fileName)
    }

    const removeFile = (
        fileName: string,
    ) => {
        if (filesNames.length === 1) {
            // dispatch(changeEditorVisibility())
            dispatch(setCurrentOpenedFileName({fileName: ""}))
        } else {
            dispatch(setCurrentOpenedFileName({
                fileName: filesNames.filter((fileName) => fileName !== fileName).filter(Boolean)[0]
            }))
        }

        dispatch(deleteFile({
            key: "photo",
            data: {
                name: fileName
            }
        }))
    }

    console.log("popup file render")

    return (
        <div className={`${styles.fileItem} ${file.name === currentFileName && styles.fileItemSelected}`}
             onClick={() => chooseAnotherFile(file.name)}
        >
            <div className={styles.fileIndex}><Text>{++index}.</Text></div>

            <div className={styles.photoPreview}>
                <FilePreviewBlock url={URL.createObjectURL(file)}
                                  alt={file.name}/>
            </div>

            <div className={styles.fileName}>
                <Text>{trimLongTitle(file.name.split(".")[0], 16)}</Text>
            </div>

            <div className={styles.removeFile} onClick={() => removeFile(file.name)}>
                <Trash style={{
                    fill: "black",
                    width: 18,
                    height: 18
                }}/>
            </div>
        </div>
    )
};

export default PopupFile;
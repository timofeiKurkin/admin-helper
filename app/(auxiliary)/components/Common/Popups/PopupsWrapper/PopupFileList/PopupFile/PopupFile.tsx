import React, {FC, useEffect, useState} from 'react';
import Text from "@/app/(auxiliary)/components/UI/TextTemplates/Text";
import FilePreviewBlock from "@/app/(auxiliary)/components/Blocks/FilePreviewBlock/FilePreviewBlock";
import {trimLongTitle} from "@/app/(auxiliary)/func/trimLongTitle";
import Trash from "@/app/(auxiliary)/components/UI/SVG/Trash/Trash";
import styles from "./PopupFile.module.scss";


interface PropsType {
    index: number;
    file: File;
    currentFileName: string;
    func: {
        switchToAnotherFile: (fileName: string) => void;
        removeFile: (removedFileName: string) => void;
    }
}

const PopupFile: FC<PropsType> = ({
                                      index,
                                      file,
                                      currentFileName,
                                      func,
                                  }) => {

    const [selectedItem, setSelectedItem] = useState<boolean>(file.name === currentFileName)

    const chooseAnotherFile = (e: React.MouseEvent<HTMLDivElement, MouseEvent>, fileName: string) => {
        // dispatch(setCurrentOpenedFileName({fileName}))
        e.stopPropagation()
        func.switchToAnotherFile(fileName)
    }

    // const removeFile = (
    //     fileName: string,
    // ) => {
    //     if (filesNames.length === 1) {
    //         if (type === VIDEO_KEY) {
    //             dispatch(changeVideoPlayerVisibility())
    //         } else if (type === PHOTO_KEY) {
    //             dispatch(changePhotoEditorVisibility())
    //         }
    //         dispatch(setCurrentOpenedFileName({fileName: ""}))
    //     } else {
    //         const anotherFile = filesNames.filter((fName) => fName !== fileName).filter(Boolean)[0]
    //         dispatch(setCurrentOpenedFileName({fileName: anotherFile}))
    //     }
    //
    //     dispatch(deleteFile({
    //         key: type,
    //         data: {
    //             name: fileName
    //         }
    //     }))
    //     dispatch(deletePhotoSettings({name: fileName}))
    // }

    useEffect(() => {
        setSelectedItem(file.name === currentFileName)
    }, [
        currentFileName,
        file.name
    ]);

    return (
        <div className={`${styles.fileItem} ${selectedItem && styles.fileItemSelected}`}
             onClick={(e) => chooseAnotherFile(e, file.name)}
        >
            <div className={styles.fileIndex}><Text>{++index}.</Text></div>

            <div className={styles.photoPreview}>
                <FilePreviewBlock url={URL.createObjectURL(file)}
                                  alt={file.name}/>
            </div>

            <div className={styles.fileName}>
                <Text>{trimLongTitle(file.name.split(".")[0], 16)}</Text>
            </div>

            <div className={styles.removeFile} onClick={() => func.removeFile(file.name)}>
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
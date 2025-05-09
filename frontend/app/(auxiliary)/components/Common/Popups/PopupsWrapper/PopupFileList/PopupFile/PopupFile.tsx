import React, { FC, useEffect, useState } from 'react';
import Text from "@/app/(auxiliary)/components/UI/TextTemplates/Text";
import FilePreviewBlock from "@/app/(auxiliary)/components/Blocks/FilePreviewBlock/FilePreviewBlock";
import Trash from "@/app/(auxiliary)/components/UI/SVG/Trash/Trash";
import styles from "./PopupFile.module.scss";
import { DivMouseEventHandler } from "@/app/(auxiliary)/types/AppTypes/AppTypes";
import { useAppSelector } from "@/app/(auxiliary)/libs/redux-toolkit/store/hooks";
import { selectUserDevice } from "@/app/(auxiliary)/libs/redux-toolkit/store/slices/AppSlice/AppSlice";
import { CustomFile } from "@/app/(auxiliary)/types/FormTypes/PopupTypes/PopupTypes";
import covers from "@/app/(auxiliary)/components/UI/Covers/HideLongTitleCover.module.scss";
import PreviewAdaptive from '@/app/(auxiliary)/components/Blocks/FormBlock/CoupleOfInputs/CurrentInput/FileInput/FilesList/File/PreviewAdaptive';
import { PhotoAndVideoKeysType } from '@/app/(auxiliary)/types/AppTypes/InputHooksTypes';


interface PropsType {
    index: number;
    file: File;
    currentFileName: string;
    type: PhotoAndVideoKeysType;
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
    type
}) => {
    // const popup
    const padAdaptive = useAppSelector(selectUserDevice).padAdaptive640_992
    const [selectedItem, setSelectedItem] = useState<boolean>(file.name === currentFileName)

    const chooseAnotherFile = (fileName: string) => {
        if (padAdaptive) return
        func.switchToAnotherFile(fileName)
    }

    const removeFile = (e: DivMouseEventHandler, fileName: string) => {
        e.stopPropagation()
        func.removeFile(fileName)
    }

    useEffect(() => {
        setSelectedItem(file.name === currentFileName)
    }, [
        currentFileName,
        file.name
    ]);

    if (Object.keys(file).length) {
        return (
            <div className={`${styles.fileItem} ${selectedItem && styles.fileItemSelected}`}
                onClick={() => chooseAnotherFile(file.name)}>
                <div className={styles.fileIndex}><Text>{++index}.</Text></div>

                <div className={styles.photoPreview}>
                    <PreviewAdaptive file={file} type={type} />
                </div>

                <div className={`${styles.fileName} ${covers.hideLongTitleCover}`}>
                    <Text>{file.name}</Text>
                </div>

                <div className={styles.removeFile} onClick={(e) => removeFile(e, file.name)}>
                    <Trash style={{
                        fill: "black",
                        width: 18,
                        height: 18
                    }} />
                </div>
            </div>
        )
    }
};

export default PopupFile;
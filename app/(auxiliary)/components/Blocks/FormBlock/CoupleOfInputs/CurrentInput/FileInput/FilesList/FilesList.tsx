import React, {FC, useEffect, useState} from 'react';
import styles from "./FilesList.module.scss";
import ButtonText from "@/app/(auxiliary)/components/UI/TextTemplates/ButtonText";
import FilePreview
    from "@/app/(auxiliary)/components/Blocks/FormBlock/CoupleOfInputs/CurrentInput/FileInput/FilesList/File/FilePreview";
import {FileListStateType} from "@/app/(auxiliary)/types/AppTypes/Context";
import {PhotoAndVideoKeysTypes} from "@/app/(auxiliary)/types/AppTypes/InputHooksTypes";
import {useAppDispatch, useAppSelector} from "@/app/(auxiliary)/libs/redux-toolkit/store/hooks";
import {
    deleteFileData,
    selectFormFileData
} from "@/app/(auxiliary)/libs/redux-toolkit/store/slices/UserFormDataSlice/UserFormDataSlice";

interface PropsType {
    placeholder: string;
    type: PhotoAndVideoKeysTypes;
    changeFile: (fileName: string) => void;
}

const FilesList: FC<PropsType> = ({
                                      placeholder,
                                      type,
                                      changeFile
                                  }) => {
    const dispatch = useAppDispatch()
    const formFileData = useAppSelector(selectFormFileData)

    const [currentFilesList, setCurrentFilesList] =
        useState<FileListStateType>(() => formFileData[type] || {} as FileListStateType)

    const removeFile = (
        fileName: string,
    ) => {
        dispatch(deleteFileData({
            key: type,
            data: {
                name: fileName
            }
        }))
    }

    useEffect(() => {
        setCurrentFilesList(() => formFileData[type] || {} as FileListStateType)
    }, [
        type,
        formFileData
    ]);


    return (
        <div className={styles.filesListWrapper}>
            <div className={styles.filesList} style={{
                gridTemplateColumns: currentFilesList.files.length ? `repeat(${currentFilesList.files.length}, 5rem)` : "1fr",
                overflowX: currentFilesList.files.length ? "auto" : "hidden"
            }}>
                {currentFilesList.files.length ? (
                        currentFilesList.files.map((file, i) => (
                            <FilePreview key={`key=${i}`}
                                         file={file}
                                         removeHandler={removeFile}
                                         changeFile={changeFile}/>
                        ))
                    )
                    :
                    <div className={styles.emptyList}>
                        <ButtonText>{placeholder}</ButtonText>
                    </div>
                }
            </div>
        </div>
    );
};

export default FilesList;
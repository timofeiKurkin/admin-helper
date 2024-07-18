import React, {FC, useContext, useEffect, useState} from 'react';
import styles from "./FilesList.module.scss";
import ButtonText from "@/app/(auxiliary)/components/UI/TextTemplates/ButtonText";
import File
    from "@/app/(auxiliary)/components/Blocks/FormBlock/CoupleOfInputs/CurrentInput/FileInput/FilesList/File/File";
import {AppContext} from "@/app/(auxiliary)/components/Common/Provider/Provider";
import {FileListStateType} from "@/app/(auxiliary)/types/AppTypes/Context";
import {PhotoAndVideoInputType} from "@/app/(auxiliary)/types/AppTypes/InputHooksTypes";

interface PropsType {
    placeholder: string;
    type: PhotoAndVideoInputType;
}

const FilesList: FC<PropsType> = ({
                                      placeholder,
                                      type
                                  }) => {
    const {appState, setAppState} = useContext(AppContext)
    const [currentFilesList, setCurrentFilesList] =
        useState<FileListStateType>(() => (type === appState.videoList?.type ? appState.videoList : appState.photoList) || {} as FileListStateType)

    const removeFile = (
        fileName: string,
    ) => {
        currentFilesList.files = currentFilesList.files.filter((file) => file.name !== fileName)

        if (type === "photo") {
            setAppState({
                ...appState,
                photoList: {
                    ...appState.photoList,
                    files: [...currentFilesList.files]
                }
            })
        } else if (type === "video") {

        }
    }

    useEffect(() => {
        setCurrentFilesList(() => (type === 'video' ? appState.videoList : appState.photoList) || {} as FileListStateType)
    }, [
        type,
        appState.photoList,
        appState.videoList
    ]);


    return (
        <div className={styles.filesListWrapper}>
            <div className={styles.filesList}>
                {currentFilesList.files.length ? (
                        currentFilesList.files.map((file, i) => (
                            <File key={`key=${i}`}
                                  file={file}
                                  removeHandler={removeFile}/>
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
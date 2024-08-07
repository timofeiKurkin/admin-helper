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
        useState<FileListStateType>(() => {
                if (appState.userDataFromForm?.fileData) {
                    return appState.userDataFromForm?.fileData[type] || {} as FileListStateType
                }

                return {} as FileListStateType
            }
        )

    const removeFile = (
        fileName: string,
    ) => {
        currentFilesList.files = currentFilesList.files.filter((file) => file.name !== fileName)

        if (appState.userDataFromForm?.fileData) {
            setAppState({
                ...appState,
                userDataFromForm: {
                    ...appState.userDataFromForm,
                    fileData: {
                        ...appState.userDataFromForm?.fileData,
                        [type]: {
                            ...appState.userDataFromForm?.fileData[type],
                            files: [
                                ...currentFilesList.files
                            ]
                        }
                    }
                }
            })
        }

        // if (type === "photo") {
        //     setAppState({
        //         ...appState,
        //         photoList: {
        //             ...appState.photoList,
        //             files: [...currentFilesList.files]
        //         }
        //     })
        // } else if (type === "video") {
        //     setAppState({
        //         ...appState,
        //         videoList: {
        //             ...appState.videoList,
        //             files: [...currentFilesList.files]
        //         }
        //     })
        // }
    }

    useEffect(() => {
        setCurrentFilesList(() => {
            if (appState.userDataFromForm?.fileData) {
                return appState.userDataFromForm?.fileData[type] || {} as FileListStateType
            }

            return {} as FileListStateType
        })
    }, [
        type,
        appState.userDataFromForm?.fileData,
    ]);


    return (
        <div className={styles.filesListWrapper}>
            <div className={styles.filesList} style={{
                gridTemplateColumns: currentFilesList.files.length ? `repeat(${currentFilesList.files.length}, 5rem)` : "1fr",
                overflowX: currentFilesList.files.length ? "auto" : "hidden"
            }}>
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
import React, {FC, useContext, useEffect, useState} from 'react';
import styles from "./FilesList.module.scss";
import ButtonText from "@/app/(auxiliary)/components/UI/TextTemplates/ButtonText";
import File
    from "@/app/(auxiliary)/components/Blocks/FormBlock/CoupleOfInputs/CurrentInput/FileInput/FilesList/File/File";
import {AppContext} from "@/app/(auxiliary)/components/Common/Provider/Provider";
import {FileListStateType} from "@/app/(auxiliary)/types/AppTypes/Context";
import {PhotoAndVideoType} from "@/app/(auxiliary)/types/AppTypes/InputHooksTypes";

interface PropsType {
    placeholder: string;
    type: PhotoAndVideoType;
    changeFile: (fileName: string, index: number) => void;
}

const FilesList: FC<PropsType> = ({
                                      placeholder,
                                      type,
                                      changeFile
                                  }) => {
    const {appState, setAppState} = useContext(AppContext)
    const [currentFilesList, setCurrentFilesList] =
        useState<FileListStateType>(() => {
                if (appState.userFormData?.file_data) {
                    return appState.userFormData?.file_data[type] || {} as FileListStateType
                }

                return {} as FileListStateType
            }
        )

    const removeFile = (
        fileName: string,
    ) => {
        currentFilesList.files = currentFilesList.files.filter((file) => file.name !== fileName)

        if (appState.userFormData?.file_data) {
            setAppState({
                ...appState,
                userFormData: {
                    ...appState.userFormData,
                    file_data: {
                        ...appState.userFormData?.file_data,
                        [type]: {
                            ...appState.userFormData?.file_data[type],
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
            if (appState.userFormData?.file_data) {
                return appState.userFormData?.file_data[type] || {} as FileListStateType
            }

            return {} as FileListStateType
        })
    }, [
        type,
        appState.userFormData?.file_data,
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
                                  fileIndex={i}
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
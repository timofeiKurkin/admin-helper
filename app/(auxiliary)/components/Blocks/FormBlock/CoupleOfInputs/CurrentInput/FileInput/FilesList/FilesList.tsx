import React, {FC, useCallback, useEffect, useRef, useState} from 'react';
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
import ArrowForList from "@/app/(auxiliary)/components/UI/SVG/ArrowForList/ArrowForList";
import HorizontalScroll from "@/app/(auxiliary)/components/Blocks/HorizontalScroll/HorizontalScroll";

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
    const [filesListLength, setFilesListLength] = useState<number>(currentFilesList.files.length)

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
        setCurrentFilesList(() => formFileData[type])
        setFilesListLength(() => formFileData[type].files.length)
    }, [
        type,
        formFileData
    ]);


    return <HorizontalScroll filesListLength={filesListLength}
                             placeholder={placeholder}
                             currentFilesList={currentFilesList}
                             removeFile={removeFile}
                             changeFile={changeFile}/>
};

export default FilesList;
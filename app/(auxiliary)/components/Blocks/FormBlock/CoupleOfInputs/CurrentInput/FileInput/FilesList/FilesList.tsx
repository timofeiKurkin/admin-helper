import React, {FC, useEffect, useState} from 'react';
import {PhotoAndVideoKeysTypes} from "@/app/(auxiliary)/types/AppTypes/InputHooksTypes";
import {useAppDispatch, useAppSelector} from "@/app/(auxiliary)/libs/redux-toolkit/store/hooks";
import {
    deleteFile,
    selectFormFileData
} from "@/app/(auxiliary)/libs/redux-toolkit/store/slices/UserFormDataSlice/UserFormDataSlice";
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
    const formFileData = useAppSelector(selectFormFileData)[type]

    const removeFile = (
        fileName: string,
    ) => {
        dispatch(deleteFile({
            key: type,
            data: {
                name: fileName
            }
        }))
    }

    console.log("previews: ", formFileData.filesFinally)

    return <HorizontalScroll filesListLength={formFileData.files.length}
                             placeholder={placeholder}
                             filesList={formFileData.filesFinally}
                             removeFile={removeFile}
                             changeFile={changeFile}/>
};

export default FilesList;
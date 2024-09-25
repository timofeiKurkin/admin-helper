import React, {FC} from 'react';
import {PhotoAndVideoKeysTypes} from "@/app/(auxiliary)/types/AppTypes/InputHooksTypes";
import {useAppDispatch, useAppSelector} from "@/app/(auxiliary)/libs/redux-toolkit/store/hooks";
import {
    deleteFile,
    selectFormFileData
} from "@/app/(auxiliary)/libs/redux-toolkit/store/slices/UserFormDataSlice/UserFormDataSlice";
import HorizontalScroll from "@/app/(auxiliary)/components/Blocks/HorizontalScroll/HorizontalScroll";
import {
    changePopupVisibility,
    setCurrentOpenedFileName
} from "@/app/(auxiliary)/libs/redux-toolkit/store/slices/PopupSlice/PopupSlice";
import styles from "@/app/(auxiliary)/components/Blocks/HorizontalScroll/HorizontalScroll.module.scss";
import FilePreviewWithHandlers
    from "@/app/(auxiliary)/components/Blocks/FormBlock/CoupleOfInputs/CurrentInput/FileInput/FilesList/File/FilePreviewWithHandlers";

interface PropsType {
    placeholder: string;
    type: PhotoAndVideoKeysTypes;
}

const FilesList: FC<PropsType> = ({
                                      placeholder,
                                      type
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

    const openFile = (fileName: string) => {
        dispatch(setCurrentOpenedFileName({fileName}))
        dispatch(changePopupVisibility({type}))
    }

    return (
        <HorizontalScroll filesListLength={formFileData.files.length}
                          placeholder={placeholder}>
            {formFileData.filesFinally.length ? formFileData.filesFinally.map((file, i) => (
                <div key={`key=${i}`} className={styles.fileWrapper}>
                    <FilePreviewWithHandlers file={file}
                                             removeFile={removeFile}
                                             openFile={openFile}/>

                </div>
            )) : null}
        </HorizontalScroll>
    )
};

export default FilesList;
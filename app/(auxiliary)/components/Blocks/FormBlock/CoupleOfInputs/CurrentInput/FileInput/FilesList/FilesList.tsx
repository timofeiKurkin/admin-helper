import React, {FC} from 'react';
import {PHOTO_KEY, PhotoAndVideoKeysTypes, VIDEO_KEY} from "@/app/(auxiliary)/types/AppTypes/InputHooksTypes";
import {useAppDispatch, useAppSelector} from "@/app/(auxiliary)/libs/redux-toolkit/store/hooks";
import {
    deleteFile,
    selectFormFileData
} from "@/app/(auxiliary)/libs/redux-toolkit/store/slices/UserFormDataSlice/UserFormDataSlice";
import HorizontalScroll from "@/app/(auxiliary)/components/Blocks/HorizontalScroll/HorizontalScroll";
import {OpenFileFuncType} from "@/app/(auxiliary)/types/PopupTypes/FuncTypes";
import {
    changePhotoEditorVisibility,
    changeVideoPlayerVisibility,
    setCurrentOpenedFileName
} from "@/app/(auxiliary)/libs/redux-toolkit/store/slices/PopupSlice/PopupSlice";

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
        if (type === VIDEO_KEY) {
            dispatch(changeVideoPlayerVisibility())
        } else if (type === PHOTO_KEY) {
            dispatch(changePhotoEditorVisibility())
        }
    }

    return <HorizontalScroll filesListLength={formFileData.files.length}
                             placeholder={placeholder}
                             filesList={formFileData.filesFinally}
                             removeFile={removeFile}
                             openFile={openFile}/>
};

export default FilesList;
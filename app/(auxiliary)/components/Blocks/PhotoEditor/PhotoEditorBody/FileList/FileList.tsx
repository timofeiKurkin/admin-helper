import React, {FC} from 'react';
import {PhotoListDataType} from "@/app/(auxiliary)/types/Data/Interface/PhotoEditor/PhotoEditorDataType";
import styles from "./FileList.module.scss";
import Text from "@/app/(auxiliary)/components/UI/TextTemplates/Text";
import FilePreviewBlock from "@/app/(auxiliary)/components/Blocks/FilePreviewBlock/FilePreviewBlock";
import Trash from "@/app/(auxiliary)/components/UI/SVG/Trash/Trash";
import {trimLongTitle} from "@/app/(auxiliary)/func/trimLongTitle";
import {FileListStateType} from "@/app/(auxiliary)/types/AppTypes/Context";
import {useAppDispatch, useAppSelector} from "@/app/(auxiliary)/libs/redux-toolkit/store/hooks";
import {deleteFileData} from "@/app/(auxiliary)/libs/redux-toolkit/store/slices/UserFormDataSlice/UserFormDataSlice";
import {
    selectCurrentFileName, setCurrentOpenedFileName
} from "@/app/(auxiliary)/libs/redux-toolkit/store/slices/PhotoEditorSlice/PhotoEditorSlice";

interface PropsType {
    data: PhotoListDataType;
    contentForEditor: {
        fileList: FileListStateType;
        switchToAnotherFile: (fileName: string) => void;
    }
}

const FileList: FC<PropsType> = ({
                                     data,
                                     contentForEditor
                                 }) => {
    const dispatch = useAppDispatch()
    const currentFileName = useAppSelector(selectCurrentFileName)

    const chooseAnotherFile = (fileName: string) => {
        contentForEditor.switchToAnotherFile(fileName)
    }

    const removeFile = (
        fileName: string,
    ) => {
        dispatch(setCurrentOpenedFileName({
            fileName: contentForEditor.fileList.files.filter((file) => file.name !== fileName).filter(Boolean)[0].name
        }))
        dispatch(deleteFileData({
            key: contentForEditor.fileList.type,
            data: {
                name: fileName
            }
        }))
    }

    return (
        <div className={styles.photoListWrapper}>
            <Text>{data.uploadedPhotos}</Text>

            <div className={styles.photoList} style={{
                gridTemplateRows: `repeat(${contentForEditor.fileList.files.length}, 4rem)`
            }}>
                {contentForEditor.fileList.files.map((file, index) => {
                    return (
                        <div key={`key=${index}`}
                             className={`${styles.fileItem} ${file.name === currentFileName && styles.fileItemSelected}`}
                             onClick={() => chooseAnotherFile(file.name)}
                        >
                            <div className={styles.photoPreview}>
                                <FilePreviewBlock url={file.url} alt={`user's file for change - ${file.name}`}/>
                            </div>

                            <Text>{trimLongTitle(file.name.split(".")[0], 14)}</Text>

                            <div className={styles.removeFile} onClick={() => removeFile(file.name)}>
                                <Trash style={{
                                    fill: "black",
                                    width: 18,
                                    height: 18
                                }}/>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    );
};

export default FileList;
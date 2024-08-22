import React, {FC, useContext} from 'react';
import {PhotoListDataType} from "@/app/(auxiliary)/types/Data/Interface/PhotoEditor/PhotoEditorDataType";
import {AppContext} from "@/app/(auxiliary)/components/Common/Provider/Provider";
import styles from "./FileList.module.scss";
import Text from "@/app/(auxiliary)/components/UI/TextTemplates/Text";
import FilePreviewBlock from "@/app/(auxiliary)/components/Blocks/FilePreviewBlock/FilePreviewBlock";

interface PropsType {
    data: PhotoListDataType;
    contentForEditor: {
        currentPhotoIndex: number;
        fileList: File[];
        switchToAnotherFile: (index: number) => void;
    }
}

const FileList: FC<PropsType> = ({
                                     data,
                                     contentForEditor
                                 }) => {
    // const files = [1, 2, 3]
    // const selected = 1

    const chooseAnotherFile = (index: number) => {
        contentForEditor.switchToAnotherFile(index)
    }

    return (
        <div className={styles.photoListWrapper}>
            <Text>{data.uploadedPhotos}</Text>

            <div className={styles.photoList} style={{
                gridTemplateRows: `repeat(${contentForEditor.fileList.length}, 4.375rem)`
            }}>
                {contentForEditor.fileList.map((file, index) => {
                    return (
                        <div key={`key=${index}`}
                             className={`${styles.fileItem} ${index === contentForEditor.currentPhotoIndex && styles.fileItemSelected}`}
                             onClick={() => chooseAnotherFile(index)}
                        >
                            <FilePreviewBlock file={file} alt={`user's file for change - ${file.name}`}/>
                        </div>
                    )
                })}
            </div>
        </div>
    );
};

export default FileList;
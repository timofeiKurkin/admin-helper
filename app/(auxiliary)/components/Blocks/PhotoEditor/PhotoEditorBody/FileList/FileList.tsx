import React, {FC, useContext} from 'react';
import {PhotoListType} from "@/app/(auxiliary)/types/Data/Interface/PhotoEditor/PhotoEditorType";
import {AppContext} from "@/app/(auxiliary)/components/Common/Provider/Provider";
import styles from "./FileList.module.scss";
import Text from "@/app/(auxiliary)/components/UI/TextTemplates/Text";

interface PropsType {
    content: PhotoListType;
    fileList: {}[];
}

const FileList: FC<PropsType> = ({
                                     content,
                                     fileList
                                 }) => {
    const files = [1, 2, 3]
    const selected = 1

    const chooseAnotherFile = (fileName: string | number) => {

    }

    return (
        <div className={styles.photoListWrapper}>
            <Text>{content.uploadedPhotos}</Text>

            <div className={styles.photoList} style={{
                gridTemplateRows: `repeat(${files.length}, 4.375rem)`
            }}>
                {files.map((file, index ) => (
                    <div key={`key=${index}`}
                         className={`${styles.fileItem} ${index === selected && styles.fileItemSelected}`}
                         onClick={() => chooseAnotherFile(file)}
                    >
                        {file}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FileList;
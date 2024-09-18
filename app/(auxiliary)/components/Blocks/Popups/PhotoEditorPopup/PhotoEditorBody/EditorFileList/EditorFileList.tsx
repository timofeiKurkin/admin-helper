import React, {FC} from 'react';
import {PhotoListDataType} from "@/app/(auxiliary)/types/Data/Interface/PhotoEditor/PhotoEditorDataType";
import styles from "./EditorFileList.module.scss";
import Text from "@/app/(auxiliary)/components/UI/TextTemplates/Text";
import {PhotoAndVideoKeysTypes} from "@/app/(auxiliary)/types/AppTypes/InputHooksTypes";
import EditorFile
    from "@/app/(auxiliary)/components/Blocks/Popups/PhotoEditorPopup/PhotoEditorBody/EditorFileList/EditorFile/EditorFile";

interface PropsType {
    contentForEditor: {
        data: PhotoListDataType;
        listOfPreviews: File[];
        type: PhotoAndVideoKeysTypes;
        switchToAnotherFile: (fileName: string) => void;
    }
}

const EditorFileList: FC<PropsType> = ({
                                           contentForEditor
                                       }) => {

    return (
        <div className={styles.photoListWrapper}>
            <Text>{contentForEditor.data.uploadedPhotos}</Text>

            <div className={styles.photoList}>
                <div className={styles.photoListScroll} style={{
                    gridTemplateRows: `repeat(${contentForEditor.listOfPreviews.length}, 4rem)`
                }}>
                    {contentForEditor.listOfPreviews.map((file, index) => {
                        return (
                            <EditorFile key={`key=${index}`}
                                        file={file}
                                        index={index}
                                        type={contentForEditor.type}
                                        switchToAnotherFile={contentForEditor.switchToAnotherFile}/>
                        )
                    })}
                </div>
            </div>
        </div>
    );
};

export default EditorFileList;
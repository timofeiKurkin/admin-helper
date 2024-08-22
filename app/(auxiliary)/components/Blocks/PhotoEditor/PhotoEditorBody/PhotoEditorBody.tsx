import React, {FC, useEffect, useState} from 'react';
import Editor from "@/app/(auxiliary)/components/Blocks/PhotoEditor/PhotoEditorBody/Editor/Editor";
import styles from "./PhotoEditorBody.module.scss";
import SeparatingLine from "@/app/(auxiliary)/components/UI/SeparatingLine/SeparatingLine";
import FileList from "@/app/(auxiliary)/components/Blocks/PhotoEditor/PhotoEditorBody/FileList/FileList";
import {
    EditorDataType,
    PhotoListDataType
} from "@/app/(auxiliary)/types/Data/Interface/PhotoEditor/PhotoEditorDataType";


interface PropsType {
    data: {
        editorData: EditorDataType;
        fileListData: PhotoListDataType;
    }
    contentForEditor: {
        currentPhotoIndex: number;
        // currentPhoto: File;
        fileList: File[];
        switchToAnotherFile: (index: number) => void;
    }
}

const PhotoEditorBody: FC<PropsType> = ({
                                            data,
                                            contentForEditor
                                        }) => {
    const [currentPhoto, setCurrentPhoto] =
        useState<File>(() => contentForEditor.fileList[contentForEditor.currentPhotoIndex])
    console.log("contentForEditor.currentPhotoIndex", contentForEditor.currentPhotoIndex)

    useEffect(() => {
        setCurrentPhoto(contentForEditor.fileList[contentForEditor.currentPhotoIndex])
    }, [
        contentForEditor.currentPhotoIndex,
        contentForEditor.fileList
    ])

    return (
        <div className={styles.photoEditorBody}>
            <Editor content={data.editorData}
                    currentPhoto={currentPhoto}/>

            <SeparatingLine className={styles.separatedLine}/>

            <FileList data={data.fileListData}
                      contentForEditor={{
                          fileList: contentForEditor.fileList,
                          currentPhotoIndex: contentForEditor.currentPhotoIndex,
                          switchToAnotherFile: contentForEditor.switchToAnotherFile
                      }}
            />
        </div>
    );
};

export default PhotoEditorBody;
import React, {FC} from 'react';
import Editor from "@/app/(auxiliary)/components/Blocks/PhotoEditor/PhotoEditorBody/Editor/Editor";
import styles from "./PhotoEditorBody.module.scss";
import SeparatingLine from "@/app/(auxiliary)/components/UI/SeparatingLine/SeparatingLine";
import FileList from "@/app/(auxiliary)/components/Blocks/PhotoEditor/PhotoEditorBody/FileList/FileList";
import {EditorType, PhotoListType} from "@/app/(auxiliary)/types/Data/Interface/PhotoEditor/PhotoEditorType";


interface PropsType {
    editorContent: EditorType;
    photoListContent: PhotoListType;

}

const PhotoEditorBody: FC<PropsType> = ({
                                            editorContent,
                                            photoListContent
                                        }) => {
    return (
        <div className={styles.photoEditorBody}>
            <Editor content={editorContent}/>

            <SeparatingLine className={styles.separatedLine}/>

            <FileList content={photoListContent} fileList={[{}]}/>
        </div>
    );
};

export default PhotoEditorBody;
import React, {FC} from 'react';
import styles from "./PhotoEditor.module.scss"
import Backdrop from "@/app/(auxiliary)/components/UI/Wrappers/Backdrop/Backdrop";
import Title from "@/app/(auxiliary)/components/UI/TextTemplates/Title";
import PhotoEditorData from "@/data/interface/photo-editor/data.json"
import {PhotoEditorType} from "@/app/(auxiliary)/types/Data/Interface/PhotoEditor/PhotoEditorType";
import Button from "@/app/(auxiliary)/components/UI/Button/Button";
import PhotoEditorBody from "@/app/(auxiliary)/components/Blocks/PhotoEditor/PhotoEditorBody/PhotoEditorBody";
import {blue_dark, grey} from "@/styles/colors";

interface PropsType {
    visiblePhotoEditor: () => void;
}

const PhotoEditor: FC<PropsType> = ({
                                        visiblePhotoEditor
                                    }) => {

    const photoEditorData: PhotoEditorType = PhotoEditorData

    return (
        <Backdrop onBackdropClick={visiblePhotoEditor}>
            <div className={styles.photoEditorWrapper}>
                <div className={styles.photoEditor}>
                    <Title styles={{textAlign: "center"}}>{photoEditorData.title}</Title>

                    <PhotoEditorBody editorContent={photoEditorData.editor}
                                     photoListContent={photoEditorData.photoList}/>

                    <div className={styles.photoEditorButtons}>
                        <Button style={{backgroundColor: blue_dark}}>{photoEditorData.buttons.save}</Button>
                        <Button onClick={visiblePhotoEditor}
                                style={{backgroundColor: grey}}
                        >{photoEditorData.buttons.close}</Button>
                    </div>
                </div>
            </div>
        </Backdrop>
    );
};

export default PhotoEditor;
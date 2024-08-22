import React, {FC, useContext} from 'react';
import styles from "./PhotoEditor.module.scss"
import Backdrop from "@/app/(auxiliary)/components/UI/Wrappers/Backdrop/Backdrop";
import Title from "@/app/(auxiliary)/components/UI/TextTemplates/Title";
import PhotoEditorData from "@/data/interface/photo-editor/data.json"
import {PhotoEditorDataType} from "@/app/(auxiliary)/types/Data/Interface/PhotoEditor/PhotoEditorDataType";
import Button from "@/app/(auxiliary)/components/UI/Button/Button";
import PhotoEditorBody from "@/app/(auxiliary)/components/Blocks/PhotoEditor/PhotoEditorBody/PhotoEditorBody";
import {blue_dark, grey} from "@/styles/colors";
import {PhotoAndVideoType} from "@/app/(auxiliary)/types/AppTypes/InputHooksTypes";
import {AppContext} from "@/app/(auxiliary)/components/Common/Provider/Provider";

interface PropsType {
    visiblePhotoEditor: () => void;
    dataForEditor: {
        type: PhotoAndVideoType;
        currentPhotoIndex: number;
    }
    switchToAnotherFile: (index: number) => void;
    // fileList: FileListStateType;
}

const PhotoEditor: FC<PropsType> = ({
                                        visiblePhotoEditor,
                                        dataForEditor,
                                        switchToAnotherFile
                                    }) => {
    const {appState} = useContext(AppContext)
    const photoEditorData: PhotoEditorDataType = PhotoEditorData

    if (appState.userFormData?.file_data && appState.userFormData.file_data[dataForEditor.type]) {
        const fileList = appState.userFormData.file_data[dataForEditor.type]?.files || []

        return (
            <Backdrop onBackdropClick={visiblePhotoEditor}>
                <div className={styles.photoEditorWrapper} onClick={(e) => e.stopPropagation()}>
                    <div className={styles.photoEditor}>
                        <Title styles={{textAlign: "center"}}>{photoEditorData.title}</Title>

                        <PhotoEditorBody data={{
                            editorData: photoEditorData.editor,
                            fileListData: photoEditorData.photoList
                        }}
                                         contentForEditor={{
                                             currentPhotoIndex: dataForEditor.currentPhotoIndex,
                                             fileList: fileList,
                                             switchToAnotherFile: switchToAnotherFile
                                         }}/>

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
    }
};

export default PhotoEditor;
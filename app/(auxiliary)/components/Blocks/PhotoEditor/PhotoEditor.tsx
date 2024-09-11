import React, {FC} from 'react';
import styles from "./PhotoEditor.module.scss"
import Backdrop from "@/app/(auxiliary)/components/UI/Wrappers/Backdrop/Backdrop";
import Title from "@/app/(auxiliary)/components/UI/TextTemplates/Title";
import PhotoEditorData from "@/data/interface/photo-editor/data.json"
import {PhotoEditorDataType} from "@/app/(auxiliary)/types/Data/Interface/PhotoEditor/PhotoEditorDataType";
import PhotoEditorBody from "@/app/(auxiliary)/components/Blocks/PhotoEditor/PhotoEditorBody/PhotoEditorBody";
import {PhotoAndVideoKeysTypes} from "@/app/(auxiliary)/types/AppTypes/InputHooksTypes";
import {useAppSelector} from "@/app/(auxiliary)/libs/redux-toolkit/store/hooks";
import {
    selectFormFileData
} from "@/app/(auxiliary)/libs/redux-toolkit/store/slices/UserFormDataSlice/UserFormDataSlice";

interface PropsType {
    visiblePhotoEditor: () => void;
    dataForEditor: {
        inputType: PhotoAndVideoKeysTypes;
    }
    switchToAnotherFile: (fileName: string) => void;
    // fileList: FileListStateType;
}

const PhotoEditor: FC<PropsType> = ({
                                        visiblePhotoEditor,
                                        dataForEditor,
                                        switchToAnotherFile
                                    }) => {
    const formFileData = useAppSelector(selectFormFileData)
    const photoEditorData: PhotoEditorDataType = PhotoEditorData

    if (formFileData[dataForEditor.inputType]) {
        const fileList = formFileData[dataForEditor.inputType]

        return (
            <Backdrop onBackdropClick={visiblePhotoEditor}>
                <div className={styles.photoEditorWrapper}
                     onClick={(e) => e.stopPropagation()}>
                    <div className={styles.photoEditor}>
                        <div className={styles.photoEditorTitle}>
                            <Title>{photoEditorData.title}</Title>
                        </div>

                        <PhotoEditorBody data={photoEditorData}
                                         visiblePhotoEditor={visiblePhotoEditor}
                                         contentForEditor={{
                                             fileList: fileList,
                                             switchToAnotherFile: switchToAnotherFile
                                         }}/>
                    </div>
                </div>
            </Backdrop>
        );
    }
};

export default PhotoEditor;
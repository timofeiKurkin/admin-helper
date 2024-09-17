import React, {FC} from 'react';
import styles from "./PhotoEditor.module.scss"
import Backdrop from "@/app/(auxiliary)/components/UI/Wrappers/Backdrop/Backdrop";
import Title from "@/app/(auxiliary)/components/UI/TextTemplates/Title";
import PhotoEditorData from "@/data/interface/photo-editor/data.json"
import {PhotoEditorDataType} from "@/app/(auxiliary)/types/Data/Interface/PhotoEditor/PhotoEditorDataType";
import PhotoEditorBody from "@/app/(auxiliary)/components/Blocks/PhotoEditor/PhotoEditorBody/PhotoEditorBody";
import {PhotoAndVideoKeysTypes} from "@/app/(auxiliary)/types/AppTypes/InputHooksTypes";
import {useAppDispatch} from "@/app/(auxiliary)/libs/redux-toolkit/store/hooks";
import {
    changeEditorVisibility
} from "@/app/(auxiliary)/libs/redux-toolkit/store/slices/PhotoEditorSlice/PhotoEditorSlice";

interface PropsType {
    inputType: PhotoAndVideoKeysTypes;
}

const PhotoEditor: FC<PropsType> = ({
                                        inputType
                                    }) => {
    const dispatch = useAppDispatch()
    const photoEditorData: PhotoEditorDataType = PhotoEditorData

    // console.log("input type: ", inputType)

    const backDropClickHandler = () => {
        dispatch(changeEditorVisibility())
    }

    return (
        <Backdrop onBackdropClick={backDropClickHandler}>
            <div className={styles.photoEditorWrapper}
                 onClick={(e) => e.stopPropagation()}>
                <div className={styles.photoEditor}>
                    <div className={styles.photoEditorTitle}>
                        <Title>{photoEditorData.title}</Title>
                    </div>

                    <PhotoEditorBody data={photoEditorData}
                                     type={inputType}/>
                </div>
            </div>
        </Backdrop>
    );
};

export default PhotoEditor;
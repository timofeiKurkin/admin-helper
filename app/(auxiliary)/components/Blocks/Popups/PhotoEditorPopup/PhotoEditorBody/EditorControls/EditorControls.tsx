import React, { FC } from 'react';
import styles from "./CommonEditorStyles.module.scss";
import RotateControl
    from "@/app/(auxiliary)/components/Blocks/Popups/PhotoEditorPopup/PhotoEditorBody/EditorControls/RotateControl/RotateControl";
import ScaleControl
    from "@/app/(auxiliary)/components/Blocks/Popups/PhotoEditorPopup/PhotoEditorBody/EditorControls/ScaleControl/ScaleControl"
import { ControlsPropsType } from "@/app/(auxiliary)/types/FormTypes/PopupTypes/PopupTypes";

interface PropsType {
    scaleProps: ControlsPropsType;
    rotateProps: ControlsPropsType;
}

const EditorControls: FC<PropsType> = ({
    scaleProps,
    rotateProps
}) => {

    return (
        <div className={styles.editorControls}>
            <ScaleControl {...scaleProps} />
            <RotateControl {...rotateProps} />
        </div>
    );
};

export default EditorControls;
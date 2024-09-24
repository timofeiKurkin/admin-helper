import React, {FC} from 'react';
import commonStyles from "../CommonEditorStyles.module.scss"
import Text from "@/app/(auxiliary)/components/UI/TextTemplates/Text";
import Range from "@/app/(auxiliary)/components/UI/Inputs/Range/Range";
import {rotatePoints, rotateStickPoint, stickToClosestValue} from "@/app/(auxiliary)/func/editorHandlers";
import {ControlsPropsType} from "@/app/(auxiliary)/types/PopupTypes/PopupTypes";
import RangeTicks
    from "@/app/(auxiliary)/components/Blocks/Popups/PhotoEditorPopup/PhotoEditorBody/EditorControls/RangeTicks/RangeTicks";


const RotateControl: FC<ControlsPropsType> = ({
                                          data,
                                          value,
                                          updateFunc
                                      }) => {

    const rotateImageHandler = (value: number) => {
        const newValue = Math.min(180, Math.max(-180, Number(value)))
        updateFunc(stickToClosestValue(newValue, rotatePoints, rotateStickPoint))
    }

    return (
        <>
            <div className={commonStyles.editorTitle}><Text>{data}</Text></div>
            <div className={commonStyles.controlsWrapper}>
                <Range onChange={(e) => rotateImageHandler(Number(e.target.value))}
                       value={value}
                       maxValue={180}
                       minValue={-180}
                       step={2}/>

                <RangeTicks changeImageHandler={rotateImageHandler}
                            type={"rotate"}/>
            </div>
        </>
    );
};

export default RotateControl;
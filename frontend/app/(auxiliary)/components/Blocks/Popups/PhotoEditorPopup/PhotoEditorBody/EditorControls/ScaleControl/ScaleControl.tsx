import React, { FC } from 'react';
import commonStyles from "../CommonEditorStyles.module.scss";
import Text from "@/app/(auxiliary)/components/UI/TextTemplates/Text";
import { scalePoints, scaleStickPoint, stickToClosestValue } from "@/app/(auxiliary)/func/editorHandlers";
import Range from "@/app/(auxiliary)/components/UI/Inputs/Range/Range";
import { ControlsPropsType } from "@/app/(auxiliary)/types/FormTypes/PopupTypes/PopupTypes";
import RangeTicks
    from "@/app/(auxiliary)/components/Blocks/Popups/PhotoEditorPopup/PhotoEditorBody/EditorControls/RangeTicks/RangeTicks";

const ScaleControl: FC<ControlsPropsType> = ({
    data,
    value,
    updateFunc
}) => {
    const scaleImageHandler = (value: number) => {
        updateFunc(stickToClosestValue(value, scalePoints, scaleStickPoint))
    }

    return (
        <>
            <div className={commonStyles.editorTitle}><Text>{data}</Text></div>
            <div className={commonStyles.controlsWrapper}>
                <Range onChange={(e) => scaleImageHandler(Number(e.target.value))}
                    value={value}
                    maxValue={2.5}
                    minValue={0.5}
                    step={0.01}
                />
                <RangeTicks changeImageHandler={scaleImageHandler} type={"scale"} />
            </div>
        </>
    );
};

export default ScaleControl;
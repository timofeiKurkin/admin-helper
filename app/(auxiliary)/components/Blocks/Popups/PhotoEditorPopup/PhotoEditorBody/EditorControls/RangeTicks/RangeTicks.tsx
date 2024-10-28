import React, { FC } from 'react';
import { rotatePoints, scalePoints } from "@/app/(auxiliary)/func/editorHandlers";
import RangeTick
    from "@/app/(auxiliary)/components/Blocks/Popups/PhotoEditorPopup/PhotoEditorBody/EditorControls/RangeTicks/RangeTick/RangeTick";
import styles from "./RangeTicks.module.scss";
import { RangeTickType } from "@/app/(auxiliary)/types/FormTypes/PopupTypes/PopupTypes";

interface PropsType {
    changeImageHandler: (value: number) => void;
    type: RangeTickType;
}

const RangeTicks: FC<PropsType> = ({
    changeImageHandler,
    type,
}) => {
    const scaleMaxMin = {
        max: 2.5,
        min: 0.5
    }

    return (
        <div className={styles.rangeTicksList}>
            {type === "scale" ? scalePoints.map((scaleX) => (
                <RangeTick key={`key=${scaleX}`}
                    value={scaleX}
                    max={scaleMaxMin.max}
                    min={scaleMaxMin.min}
                    unit={"x"}
                    type={type}
                    pickTick={changeImageHandler} />
            )) : rotatePoints.map((rotate) => (
                <RangeTick key={`key=${rotate}`}
                    value={rotate}
                    type={type}
                    unit={"%"}
                    pickTick={changeImageHandler} />
            ))}
        </div>
    );
};

export default RangeTicks;
import React, {FC} from 'react';
import styles from "./ScaleControl.module.scss"
import commonStyles from "../CommonEditorStyles.module.scss";
import Text from "@/app/(auxiliary)/components/UI/TextTemplates/Text";
import {scalePoints, scaleStickPoint, stickToClosestValue} from "@/app/(auxiliary)/func/editorHandlers";
import SmallText from "@/app/(auxiliary)/components/UI/TextTemplates/SmallText";
import Range from "@/app/(auxiliary)/components/UI/Inputs/Range/Range";
import {ControlsPropsType} from "@/app/(auxiliary)/types/PopupTypes/PopupTypes";

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
            <div className={styles.scaleWrapper}>
                <Range onChange={(e) => scaleImageHandler(Number(e.target.value))}
                       value={value}
                       maxValue={2.5}
                       minValue={0.5}
                       step={0.01}
                />
                <div className={styles.scaleSliderTicks}>
                    {scalePoints.map((scaleX) => {
                        const min = 0.5
                        const max = 2.5
                        return (
                            <span key={`key=${scaleX}`}
                                  style={{
                                      left: `${((scaleX - min) / (max - min)) * 100}%`
                                  }}
                                  onClick={() => scaleImageHandler(scaleX)}>
                    <SmallText>{scaleX}x</SmallText>
                </span>
                        )
                    })}
                </div>
            </div>
        </>
    );
};

export default ScaleControl;
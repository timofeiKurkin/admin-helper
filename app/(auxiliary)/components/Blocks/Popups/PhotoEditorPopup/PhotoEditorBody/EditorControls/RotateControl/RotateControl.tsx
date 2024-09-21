import React, {FC} from 'react';
import styles from "./RotateControl.module.scss"
import commonStyles from "../CommonEditorStyles.module.scss"
import Text from "@/app/(auxiliary)/components/UI/TextTemplates/Text";
import Range from "@/app/(auxiliary)/components/UI/Inputs/Range/Range";
import {rotatePoints, rotateStickPoint, stickToClosestValue} from "@/app/(auxiliary)/func/editorHandlers";
import SmallText from "@/app/(auxiliary)/components/UI/TextTemplates/SmallText";
import {ControlsPropsType} from "@/app/(auxiliary)/types/PopupTypes/PopupTypes";


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
            <div className={styles.rotateWrapper}>
                <Range onChange={(e) => rotateImageHandler(Number(e.target.value))}
                       value={value}
                       maxValue={180}
                       minValue={-180}
                       step={1}/>

                <div className={styles.rotateSliderTicks}>
                    {rotatePoints.map((degree) => (
                        <span key={`key=${degree}`}
                              className={styles.sliderTick}
                              onClick={() => rotateImageHandler(degree)}>
                                    <SmallText>{degree}</SmallText>
                                </span>
                    ))}
                </div>
            </div>
        </>
    );
};

export default RotateControl;
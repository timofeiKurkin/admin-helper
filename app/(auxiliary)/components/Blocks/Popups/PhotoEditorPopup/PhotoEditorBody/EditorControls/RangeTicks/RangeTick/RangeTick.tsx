import React, {FC} from 'react';
import SmallText from "@/app/(auxiliary)/components/UI/TextTemplates/SmallText";
import {RangeTicksProps} from "@/app/(auxiliary)/types/PopupTypes/PopupTypes";
import styles from "../RangeTicks.module.scss";

const RangeTick: FC<RangeTicksProps> = ({
                                            value,
                                            max = 0,
                                            min = 0,
                                            type,
                                            unit,
                                            pickTick
                                        }) => {
    const tickPosition = ((value - min) / (max - min)) * 100

    return (
        <span className={`${styles.padAdaptive} ${type === "scale" ? styles.scaleSliderTicks : styles.rotateSliderTicks}`}
              style={type === "scale" ? {left: `${tickPosition}%`} : undefined}
              onClick={() => pickTick(value)}>
            <SmallText>{value}{unit}</SmallText>
        </span>
    );
};

export default RangeTick;
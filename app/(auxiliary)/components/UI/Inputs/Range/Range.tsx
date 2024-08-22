import React, {FC} from 'react';
import {InputChangeEventHandler} from "@/app/(auxiliary)/types/AppTypes/AppTypes";
import styles from "./Range.module.scss"

interface PropsType {
    onChange: (e: InputChangeEventHandler) => void;
    value: number;
    maxValue: number;
    minValue: number;
    step: number;
}

const Range: FC<PropsType> = ({
                                  onChange,
                                  value,
                                  maxValue,
                                  minValue,
                                  step
                              }) => {
    return (
        <input type="range"
               className={styles.range}
               value={value}
               onChange={(e) => onChange(e)}
               max={maxValue}
               min={minValue}
               step={step}/>
    );
};

export default Range;
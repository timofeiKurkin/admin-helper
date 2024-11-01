import React, { CSSProperties, FC } from 'react';
import { blue_dark } from "@/styles/colors";
import styles from "./SeparatingLine.module.scss";

interface PropsType {
    style?: CSSProperties;
    className?: string;
}

const SeparatingLine: FC<PropsType> = ({ style, className }) => {
    return (
        <div style={style} className={`${styles.separatingLine} ${className}`}></div>
    );
};

export default SeparatingLine;
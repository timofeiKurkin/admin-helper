import React, {CSSProperties, FC} from 'react';
import {blue_dark} from "@/styles/colors";

interface PropsType {
    style?: CSSProperties;
    className?: string;
}

const SeparatingLine: FC<PropsType> = ({style, className}) => {
    return (
        <div style={{
            width: "100%",
            height: "100%",
            backgroundColor: blue_dark,
            // backgroundColor: blue_light,
            ...style
        }} className={className}></div>
    );
};

export default SeparatingLine;
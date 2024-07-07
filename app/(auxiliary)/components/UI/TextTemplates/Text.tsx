import React, {CSSProperties, FC} from 'react'
import fontStyles from "@/styles/fonts.module.scss";
import {ChildrenType} from '@/app/(auxiliary)/types/AppTypes/AppTypes';

interface PropsType extends ChildrenType {
    style?: CSSProperties;
}

const Text: FC<PropsType> = ({children, style}) => {
    return (
        <p className={fontStyles.text} style={style}>{children}</p>
    )
}

export default Text;
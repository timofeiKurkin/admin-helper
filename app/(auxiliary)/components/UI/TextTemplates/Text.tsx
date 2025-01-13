import React, { CSSProperties, FC } from 'react'
import fontStyles from "@/styles/fonts.module.scss";
import { ChildrenProp } from '@/app/(auxiliary)/types/AppTypes/AppTypes';

interface PropsType extends ChildrenProp {
    style?: CSSProperties;
}

const Text: FC<PropsType> = ({ children, style }) => {
    return (
        <p className={fontStyles.text} style={style}>{children}</p>
    )
}

export default Text;
import React, { CSSProperties, FC } from 'react'
import fontStyles from "@/styles/fonts.module.scss";
import { ChildrenProp } from '@/app/(auxiliary)/types/AppTypes/AppTypes';

interface PropsType extends ChildrenProp {
  styles?: CSSProperties;
}

const Title: FC<PropsType> = ({ children, styles }) => {
  return (
    <h2 style={styles} className={fontStyles.title}>{children}</h2>
  )
}

export default Title
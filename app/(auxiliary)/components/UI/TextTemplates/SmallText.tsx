import React, { FC } from 'react'
import fontStyles from "@/styles/fonts.module.scss";
import { ChildrenProp } from '@/app/(auxiliary)/types/AppTypes/AppTypes';

const SmallText: FC<ChildrenProp> = ({ children }) => {
  return (
    <p className={fontStyles.smallText}>{children}</p>
  )
}

export default SmallText
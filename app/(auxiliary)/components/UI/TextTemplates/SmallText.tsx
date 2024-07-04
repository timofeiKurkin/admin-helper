import React, { FC } from 'react'
import fontStyles from "@/styles/fonts.module.scss";
import { ChildrenType } from '@/app/(auxiliary)/types/AppTypes/AppTypes';

const SmallText: FC<ChildrenType> = ({children}) => {
  return (
    <p className={fontStyles.smallText}>{children}</p>
  )
}

export default SmallText
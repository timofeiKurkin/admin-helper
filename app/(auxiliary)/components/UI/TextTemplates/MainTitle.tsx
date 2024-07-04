import React, { FC } from 'react'
import fontStyles from "@/styles/fonts.module.scss";
import { ChildrenType } from '@/app/(auxiliary)/types/AppTypes/AppTypes';

const MainTitle: FC<ChildrenType> = ({children}) => {
  return (
    <h1 className={fontStyles.mainTitle}>{children}</h1>
  )
}

export default MainTitle
import React, { FC } from 'react'
import fontStyles from "@/styles/fonts.module.scss";
import { ChildrenProp } from '@/app/(auxiliary)/types/AppTypes/AppTypes';

const MainTitle: FC<ChildrenProp> = ({ children }) => {
  return (
    <h1 className={fontStyles.mainTitle}>{children}</h1>
  )
}

export default MainTitle
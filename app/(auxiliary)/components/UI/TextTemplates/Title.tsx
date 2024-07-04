import React, { FC } from 'react'
import fontStyles from "@/styles/fonts.module.scss";
import { ChildrenType } from '@/app/(auxiliary)/types/AppTypes/AppTypes';

const Title: FC<ChildrenType> = ({children}) => {
  return (
    <h2 className={fontStyles.title}>{children}</h2>
  )
}

export default Title
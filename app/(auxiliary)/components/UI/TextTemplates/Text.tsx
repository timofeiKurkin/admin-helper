import React, { FC } from 'react'
import fontStyles from "@/styles/fonts.module.scss";
import { ChildrenType } from '@/app/(auxiliary)/types/AppTypes/AppTypes';

const Text: FC<ChildrenType> = ({children}) => {
  return (
    <p className={fontStyles.text}>{children}</p>
  )
}

export default Text
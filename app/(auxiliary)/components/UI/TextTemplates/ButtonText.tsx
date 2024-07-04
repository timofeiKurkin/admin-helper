import React, { FC } from 'react'
import fontStyles from "@/styles/fonts.module.scss";
import { ChildrenType } from '@/app/(auxiliary)/types/AppTypes/AppTypes';

const ButtonText: FC<ChildrenType> = ({children}) => {
  return (
    <p className={fontStyles.buttonText}>{children}</p>
  )
}

export default ButtonText

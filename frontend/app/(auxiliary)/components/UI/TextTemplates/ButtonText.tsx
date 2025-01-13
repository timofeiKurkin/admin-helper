import React, { FC } from 'react'
import fontStyles from "@/styles/fonts.module.scss";
import { ChildrenProp } from '@/app/(auxiliary)/types/AppTypes/AppTypes';

const ButtonText: FC<ChildrenProp> = ({ children }) => {
  return (
    <p className={fontStyles.buttonText}>{children}</p>
  )
}

export default ButtonText

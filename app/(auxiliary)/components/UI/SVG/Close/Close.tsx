import { ClassNameProp } from '@/app/(auxiliary)/types/AppTypes/AppTypes'
import React, { FC } from 'react'
import styles from "./Close.module.scss"


const Close: FC<ClassNameProp> = ({ className }) => {
    return (
        <svg viewBox="0 0 23 23" fill="none" xmlns="http://www.w3.org/2000/svg" className={`${className} ${styles.close}`}>
            <path d="M2 2L21 21" stroke="#151515" strokeWidth="3.5" strokeLinecap="round" />
            <path d="M21 2L2.00001 21" stroke="#151515" strokeWidth="3.5" strokeLinecap="round" />
        </svg>

    )
}

export default Close
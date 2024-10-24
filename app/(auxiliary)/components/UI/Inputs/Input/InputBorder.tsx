import React, { FC } from 'react'
import borderStyles from "./InputBorder.module.scss"
import { useAppSelector } from '@/app/(auxiliary)/libs/redux-toolkit/store/hooks';
import { selectDisableFormInputs } from '@/app/(auxiliary)/libs/redux-toolkit/store/slices/AppSlice/AppSlice';

interface PropsType {
    valueLength: number;
    inputIsDirty: boolean
}

const InputBorder: FC<PropsType> = ({
    valueLength,
    inputIsDirty
}) => {
    const disableFormInputs = useAppSelector(selectDisableFormInputs)
    return (
        <>
            {disableFormInputs && (
                <span className={borderStyles.inputConfirm}></span>
            )}
            {!inputIsDirty && !valueLength && (
                <span className={borderStyles.inactiveInputState}></span>
            )}
            <span className={borderStyles.inputBorder}></span>
        </>
    )
}

export default InputBorder
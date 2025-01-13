import React, { FC } from 'react'
import borderStyles from "./InputBorder.module.scss"
import { useAppSelector } from '@/app/(auxiliary)/libs/redux-toolkit/store/hooks';
import { selectDisableFormInputs } from '@/app/(auxiliary)/libs/redux-toolkit/store/slices/AppSlice/AppSlice';

interface PropsType {
    isError?: boolean;
    valueLength: number;
    inputIsDirty: boolean
}

const InputBorder: FC<PropsType> = ({
    valueLength,
    inputIsDirty,
    isError
}) => {
    const disableFormInputs = useAppSelector(selectDisableFormInputs)
    return (
        <>
            {disableFormInputs && (
                <span className={borderStyles.inputConfirm}></span>
            )}
            {isError && (
                <span className={borderStyles.inputError}></span>
            )}
            {!inputIsDirty && !valueLength && (
                <span className={borderStyles.inactiveInputState}></span>
            )}
            <span className={borderStyles.inputBorder}></span>
        </>
    )
}

export default InputBorder
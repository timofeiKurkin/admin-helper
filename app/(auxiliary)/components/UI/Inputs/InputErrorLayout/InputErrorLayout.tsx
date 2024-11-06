import React, { FC, useEffect, useState } from 'react'
import InputLoadingSkeleton from '../../Loaders/InputLoadingSkeleton/InputLoadingSkeleton'
import dynamic from 'next/dynamic'
import { InputPropsType } from '@/app/(auxiliary)/types/FormTypes/InputTypes/InputPropsType'
import { InputChangeEventHandler, TextareaChangeEventHandler } from '@/app/(auxiliary)/types/AppTypes/AppTypes'
import { TextInputsKeysType, UseInputType, ValidateKeysType } from '@/app/(auxiliary)/types/AppTypes/InputHooksTypes'
import { selectRejectionInputs } from '@/app/(auxiliary)/libs/redux-toolkit/store/slices/UserFormDataSlice/UserFormDataSlice'
import { useAppDispatch, useAppSelector } from '@/app/(auxiliary)/libs/redux-toolkit/store/hooks'
import { setNewNotification } from '@/app/(auxiliary)/libs/redux-toolkit/store/slices/AppSlice/AppSlice'
import { inputsNameError } from '../../../Blocks/FormBlock/CoupleOfInputs/CurrentInput/inputsNameError'

const LazyInput = dynamic(
    () => import("@/app/(auxiliary)/components/UI/Inputs/Input/Input"),
    {
        ssr: false,
        loading: () => <InputLoadingSkeleton />
    }
)

interface PropsType {
    // layout: {
    //     value: UseInputType<InputChangeEventHandler | TextareaChangeEventHandler>;
    //     inputType: TextInputsKeysType;
    //     setIsError?: (status: boolean) => void;
    // }
    // input?: InputPropsType<InputChangeEventHandler>;
    value: UseInputType<InputChangeEventHandler | TextareaChangeEventHandler>;
    type: TextInputsKeysType;
    setIsError: (status: boolean) => void;
    isError?: boolean;
    children: React.ReactNode;
}

const InputErrorLayout: FC<PropsType> = ({
    value,
    type: inputType,
    setIsError,
    isError,
    children
}) => {
    const dispatch = useAppDispatch()
    const rejectionInputs = useAppSelector(selectRejectionInputs)

    useEffect(() => {
        if (rejectionInputs.length) {
            const key = rejectionInputs.find((item) => item === inputType)

            if (key && !isError) {
                let message = ""

                if (value.isEmpty) {
                    message += value.isEmptyError
                } else if (value.maxLength) {
                    message += value.maxLengthError
                } else if (value.minLength) {
                    message += value.minLengthError
                }


                if (message) {
                    message = `<span style="font-weight: 500">${inputsNameError[inputType as ValidateKeysType]}</span>: ${message}`
                    dispatch(setNewNotification({ message: message, type: "error" }))
                }

                setIsError(true)
            }
        }
    }, [
        dispatch,
        rejectionInputs,
        inputType,
        setIsError,
        isError,
        value.isEmpty,
        value.isEmptyError,
        value.maxLength,
        value.maxLengthError,
        value.minLength,
        value.minLengthError
    ])

    return children
}

export default InputErrorLayout
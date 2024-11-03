import React, { FC, useEffect, useState } from 'react'
import InputLoadingSkeleton from '../../Loaders/InputLoadingSkeleton/InputLoadingSkeleton'
import dynamic from 'next/dynamic'
import { InputPropsType } from '@/app/(auxiliary)/types/FormTypes/InputTypes/InputPropsType'
import { InputChangeEventHandler } from '@/app/(auxiliary)/types/AppTypes/AppTypes'
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
    layout: {
        value: UseInputType<InputChangeEventHandler>
        inputType: TextInputsKeysType;
    }
    input: InputPropsType<InputChangeEventHandler>
}

const InputErrorLayout: FC<PropsType> = ({
    layout,
    input
}) => {
    const dispatch = useAppDispatch()
    const rejectionInputs = useAppSelector(selectRejectionInputs)
    const [isError, setIsError] = useState<boolean>(false)

    useEffect(() => {
        if (rejectionInputs.length) {
            const key = rejectionInputs.find((item) => item === layout.inputType)
            if (key) {
                const message = `${inputsNameError[layout.inputType as ValidateKeysType]}: ${layout.value.isEmptyError}`
                dispatch(setNewNotification({ message: message, type: "error" }))
                setIsError(true)
            } else {
                setIsError(false)
            }
        }
    }, [rejectionInputs, layout.inputType, dispatch, layout.value.isEmptyError])

    return <LazyInput {...input} isError={isError} />
}

export default InputErrorLayout
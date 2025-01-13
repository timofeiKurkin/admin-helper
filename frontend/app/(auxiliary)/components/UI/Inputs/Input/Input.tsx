"use client"

import React, { FC, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { InputPropsType } from "@/app/(auxiliary)/types/FormTypes/InputTypes/InputPropsType";
import { InputChangeEventHandler } from "@/app/(auxiliary)/types/AppTypes/AppTypes";
import borderStyles from "./InputBorder.module.scss";
import inputStyles from "./Input.module.scss";
import fontStyles from "@/styles/fonts.module.scss";
import { useAppSelector } from '@/app/(auxiliary)/libs/redux-toolkit/store/hooks';
import { selectDisableFormInputs } from '@/app/(auxiliary)/libs/redux-toolkit/store/slices/AppSlice/AppSlice';
import InputBorder from './InputBorder';
import { selectRejectionInputs } from '@/app/(auxiliary)/libs/redux-toolkit/store/slices/UserFormDataSlice/UserFormDataSlice';
import { inputsNameError } from '../../../Blocks/FormBlock/CoupleOfInputs/CurrentInput/inputsNameError';
import { ValidateKeysType } from '@/app/(auxiliary)/types/AppTypes/InputHooksTypes';


const Input: FC<InputPropsType<InputChangeEventHandler>> = ({
    value,
    placeholder,
    type = "text",
    disabled = false,
    maxLength,
    tabIndex,
    dynamicWidth,
    onKeyDown = () => {
    },
    onBlur,
    onChange,
    inputIsDirty,
    isError
}) => {
    const disableFormInputs = useAppSelector(selectDisableFormInputs)
    const rejectionInputs = useAppSelector(selectRejectionInputs)
    const spanRef = useRef<HTMLSpanElement>(null);

    const inputRef = useRef<HTMLInputElement>(null);
    const [inputWidth, setInputWidth] = useState<number>(0)
    // const [isError, setIsError] = useState<boolean>(false)

    const changeInputHandler = (e: InputChangeEventHandler) => {
        onChange(e)
    }

    useEffect(() => {
        if (dynamicWidth) {
            if (spanRef.current && inputRef.current) {
                spanRef.current.style.fontSize = getComputedStyle(inputRef.current).fontSize
                spanRef.current.style.letterSpacing = getComputedStyle(inputRef.current).letterSpacing
                spanRef.current.style.borderWidth = getComputedStyle(inputRef.current).borderWidth

                spanRef.current.textContent = placeholder
                const emptyWidth = spanRef.current.offsetWidth + 52

                /**
                 * If value of the input is empty
                 */
                if (!value) {
                    inputRef.current.style.width = emptyWidth + "px"
                    setInputWidth(emptyWidth)
                } else {
                    spanRef.current.textContent = value
                    const fullWidth = spanRef.current.offsetWidth + 52

                    if (fullWidth >= emptyWidth) {
                        inputRef.current.style.width = fullWidth + "px"
                        setInputWidth(fullWidth)
                    } else {
                        inputRef.current.style.width = emptyWidth + "px"
                        setInputWidth(emptyWidth)
                    }
                }
            }
        }
    }, [
        dynamicWidth,
        value,
        placeholder,
    ]);

    // useEffect(() => {
    //     if (rejectionInputs.length) {
    //         const key = rejectionInputs.find((item) => item === inputType)
    //         if (key) {
    //             const message = `${inputsNameError[inputType as ValidateKeysType]}: ${value.isEmptyError}`
    //             dispatch(setNewNotification({ message: message, type: "error" }))
    //             setIsError(true)
    //         }
    //     }
    // }, [rejectionInputs, inputType, dispatch, value.isEmptyError])

    return (
        <div className={inputStyles.inputWrapper}>
            <div className={inputStyles.inputBox}>
                <input
                    className={`${fontStyles.buttonText} ${inputStyles.inputStyle} ${(inputIsDirty || value.length) ? inputStyles.inputActive : inputStyles.inputInactive}`}

                    type={type}
                    placeholder={placeholder}
                    value={value}

                    ref={inputRef}
                    maxLength={maxLength}
                    disabled={disableFormInputs || disabled}
                    tabIndex={tabIndex}

                    onChange={(e: InputChangeEventHandler) => changeInputHandler(e)}
                    onBlur={() => onBlur()}
                    onFocus={() => onBlur()}
                    onKeyDown={(e) => onKeyDown(e)}
                />

                {dynamicWidth && (
                    <span ref={spanRef} className={fontStyles.buttonText}
                        style={{
                            visibility: "hidden",
                            position: "absolute",
                            whiteSpace: "pre",
                            top: 0,
                            left: 0
                        }}></span>
                )}
            </div>

            <div className={inputStyles.borderBox}
                style={dynamicWidth ? {
                    width: inputWidth ? `${inputWidth}px` : "auto"
                } : undefined}>
                <InputBorder valueLength={value.length}
                    inputIsDirty={!!inputIsDirty}
                    isError={isError} />
            </div>
        </div>
    )
};

export default Input;
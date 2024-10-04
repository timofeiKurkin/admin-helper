import React, {FC, useEffect, useRef, useState} from 'react';
import {InputPropsType} from "@/app/(auxiliary)/types/FormTypes/InputTypes/InputPropsType";
import {InputChangeEventHandler} from "@/app/(auxiliary)/types/AppTypes/AppTypes";
import borderStyles from "./InputBorder.module.scss";
import inputStyles from "./Input.module.scss";
import fontStyles from "@/styles/fonts.module.scss";
// import {useAppSelector} from "@/app/(auxiliary)/libs/redux-toolkit/store/hooks";
// import {selectUserDevice} from "@/app/(auxiliary)/libs/redux-toolkit/store/slices/AppSlice/AppSlice";


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
                                                                inputIsDirty
                                                            }) => {

    const spanRef = useRef<HTMLSpanElement>(null);

    const inputRef = useRef<HTMLInputElement>(null);
    const [inputWidth, setInputWidth] = useState<number>(0)

    const changeInputHandler = (e: InputChangeEventHandler) => {
        onChange(e)
    }

    useEffect(() => {
        if (dynamicWidth) {
            if (spanRef.current && inputRef.current) {
                spanRef.current.style.fontSize = getComputedStyle(inputRef.current).fontSize
                spanRef.current.style.letterSpacing = getComputedStyle(inputRef.current).letterSpacing
                spanRef.current.style.borderWidth = getComputedStyle(inputRef.current).borderWidth

                if (value && value.length >= placeholder.length / 1.4) {
                    spanRef.current.textContent = value
                    const fullWidth = spanRef.current.offsetWidth + 52
                    inputRef.current.style.width = fullWidth + "px"
                    setInputWidth(fullWidth)
                }

                if (!value && value.length <= placeholder.length / 1.4) {
                    spanRef.current.textContent = placeholder
                    const fullWidth = spanRef.current.offsetWidth + 52
                    inputRef.current.style.width = fullWidth + "px"
                    setInputWidth(fullWidth)
                }
            }
        }
    }, [
        dynamicWidth,
        value,
        placeholder,
    ]);

    return (
        <div
            className={inputStyles.inputWrapper}>
            <div className={inputStyles.inputBox}>
                <input
                    className={`${fontStyles.buttonText} ${inputStyles.inputStyle} ${(inputIsDirty || value.length) ? inputStyles.inputActive : inputStyles.inputInactive}`}

                    type={type}
                    placeholder={placeholder}
                    value={value}

                    ref={inputRef}
                    maxLength={maxLength}
                    disabled={disabled}
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
                 } : undefined}
            >
                {!(inputIsDirty || value.length) && (
                    <span className={borderStyles.inactiveInputState}></span>
                )}
                <span className={borderStyles.inputBorder}></span>
            </div>
        </div>
    );
};

export default Input;
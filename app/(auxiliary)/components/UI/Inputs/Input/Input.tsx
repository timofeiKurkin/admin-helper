import React, {FC, useEffect, useRef, useState} from 'react';
import {InputPropsType} from "@/app/(auxiliary)/types/FormTypes/InputTypes/InputPropsType";
import {InputChangeEventHandler} from "@/app/(auxiliary)/types/AppTypes/AppTypes";
import borderStyles from "./InputBorder.module.scss";
import inputStyles from "./Input.module.scss";
import fontStyles from "@/styles/fonts.module.scss";
import {setIn} from "immutable";

const Input: FC<
    InputPropsType<InputChangeEventHandler>
> = ({
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
         datalist
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
                    const fullWidth = spanRef.current.offsetWidth + 54
                    inputRef.current.style.width = fullWidth + "px"
                    setInputWidth(fullWidth)
                }

                if (!value && value.length <= placeholder.length / 1.4) {
                    spanRef.current.textContent = placeholder
                    const fullWidth = spanRef.current.offsetWidth + 54
                    inputRef.current.style.width = fullWidth + "px"
                    setInputWidth(fullWidth)

                    // setInputWidth((prevState) => prevState > fullWidth ? prevState : fullWidth)
                }
            }
        }
    }, [
        dynamicWidth,
        value,
        placeholder
    ]);


    // const dynamicWithHandler = (newTextContent: string) => {
    //     if (spanRef.current && inputRef.current) {
    //         // spanRef.current.style = getComputedStyle(inputRef.current)
    //         console.log("newTextContent", newTextContent)
    //         spanRef.current.textContent = newTextContent || placeholder
    //         inputRef.current.style.width = spanRef.current.offsetWidth + "px"
    //         setInputWidth(spanRef.current.offsetWidth)
    //     }
    // }

    return (
        <div
            className={`${inputStyles.inputWrapper} ${inputIsDirty ? inputStyles.inputActive : inputStyles.inputInactive}`}>
            <div className={inputStyles.inputBox}>
                <input
                    className={`${fontStyles.buttonText} ${inputStyles.inputStyle}`}

                    type={type}
                    placeholder={placeholder}
                    value={value}

                    ref={inputRef}
                    maxLength={maxLength}
                    disabled={disabled}
                    tabIndex={tabIndex}
                    list={value.length > 2 && datalist?.listType || ""}

                    onChange={(e: InputChangeEventHandler) => changeInputHandler(e)}
                    onBlur={() => onBlur()}
                    onFocus={() => onBlur()}
                    onKeyDown={(e) => onKeyDown(e)}
                />

                {datalist ? (
                    <datalist id={datalist.listType}>
                        {datalist.list.map((item, index) => (
                            <option key={`key=${index}`} value={item}></option>
                        ))}
                    </datalist>
                ) : null}

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
            <span
                style={dynamicWidth ? {
                    width: inputWidth ? `${inputWidth}px` : "auto"
                } : undefined}
                className={borderStyles.inputBorder}></span>
        </div>
    );
};

export default Input;
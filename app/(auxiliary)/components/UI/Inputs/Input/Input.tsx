import React, {FC} from 'react';
import {InputPropsType} from "@/app/(auxiliary)/types/FormTypes/InputTypes/InputPropsType";
import {InputChangeEventHandler} from "@/app/(auxiliary)/types/AppTypes/AppTypes";
import borderStyles from "./InputBorder.module.scss";
import inputStyles from "./Input.module.scss";
import fontStyles from "@/styles/fonts.module.scss";

const Input: FC<InputPropsType<InputChangeEventHandler>> = ({
                                       value,
                                       placeholder,
                                       type = "text",
                                       disabled = false,
                                       maxLength,
                                       tabIndex,
                                       onKeyDown = () => {},
                                       onBlur,
                                       onChange,
                                       inputIsDirty
                                   }) => {

    const changeInputHandler = (e: InputChangeEventHandler) => {
        onChange(e)
    }

    return (
        <div
            className={`${inputStyles.inputWrapper} ${inputIsDirty ? inputStyles.inputActive : inputStyles.inputInactive}`}>
            <div className={inputStyles.inputBox}>
                <input
                    className={`${fontStyles.buttonText} ${inputStyles.inputStyle}`}

                    type={type}
                    value={value}
                    onChange={(e: InputChangeEventHandler) => changeInputHandler(e)}
                    onBlur={() => onBlur()}
                    onFocus={() => onBlur()}
                    onKeyDown={(e) => onKeyDown(e)}
                    placeholder={placeholder}
                    maxLength={maxLength}
                    disabled={disabled}
                    tabIndex={tabIndex}
                />
            </div>
            <span
                className={borderStyles.inputBorder}></span>
        </div>
    );
};

export default Input;
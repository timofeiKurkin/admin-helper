import React, {FC} from 'react';
import {InputPropsType} from "@/app/(auxiliary)/types/FormTypes/InputTypes/InputPropsType";
import {TextareaChangeEventHandler} from "@/app/(auxiliary)/types/AppTypes/AppTypes";
import borderStyles from "@/app/(auxiliary)/components/UI/Inputs/Input/InputBorder.module.scss";
import styles from "./Textarea.module.scss"
import generalStyles from "@/app/(auxiliary)/components/UI/Inputs/Input/Input.module.scss"
import fontStyles from "@/styles/fonts.module.scss";
import inputStyles from "@/app/(auxiliary)/components/UI/Inputs/Input/Input.module.scss";


const Textarea: FC<
    InputPropsType<TextareaChangeEventHandler>
> = ({
         value,
         placeholder,
         disabled = false,
         maxLength,
         tabIndex,
         onBlur,
         onChange,
         inputIsDirty
     }) => {

    const changeTextareaHandler = (e: TextareaChangeEventHandler) => {
        onChange(e)
    }

    return (
        <div
            className={generalStyles.inputWrapper}>
            <div className={generalStyles.inputBox}>
                <textarea value={value}
                          placeholder={placeholder}
                          disabled={disabled}
                          maxLength={maxLength}
                          tabIndex={tabIndex}
                          onBlur={() => onBlur()}
                          onFocus={() => onBlur()}
                          onChange={(e) => changeTextareaHandler(e)}
                          className={`${styles.textareaStyle} ${fontStyles.buttonText} ${inputIsDirty ? generalStyles.inputActive : generalStyles.inputInactive}`}/>

            </div>

            <div className={inputStyles.borderBox}>
                {!inputIsDirty && (
                    <span className={borderStyles.inactiveInputState}></span>
                )}
                <span className={borderStyles.inputBorder}></span>
            </div>
        </div>
    );
};

export default Textarea;
import {KeyBoardEventHandler} from "@/app/(auxiliary)/types/AppTypes/AppTypes";
import React from "react";
import {UseInputType} from "@/app/(auxiliary)/types/AppTypes/InputHooksTypes";

export const inputHandleKeyDown = <
    E extends KeyBoardEventHandler<HTMLInputElement>,
    T extends UseInputType
>(
    e: E,
    value: T
) => {
    const isDigit = /\d/.test(e.key);
    const isControl = [
        'Backspace',
        'ArrowLeft',
        'ArrowRight',
        'Delete',
        'Tab',
        "Control",
        "v"
    ].includes(e.key);

    if (!isDigit && !isControl) {
        e.preventDefault();
    }

    if (e.key === 'Backspace' && !isDigit) {
        if (value.value.length >= 4 && value.value.endsWith(" - ")) {
            e.preventDefault()
            value.onChange({target: {value: value.value.slice(0, -3)}} as React.ChangeEvent<HTMLInputElement>)
        } else if (value.value.length >= 4 && (value.value.endsWith(" ") || value.value.endsWith("-"))) {
            e.preventDefault()
            value.onChange({target: {value: value.value.slice(0, -1)}} as React.ChangeEvent<HTMLInputElement>)
        }
    }
};
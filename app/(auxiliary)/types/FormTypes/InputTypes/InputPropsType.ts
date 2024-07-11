import React from "react";
import {InputChangeEventHandler} from "@/app/(auxiliary)/types/AppTypes/AppTypes";

export interface InputPropsType {
    value: string;
    placeholder: string;
    type?: "text" | "password";
    disabled?: boolean;
    maxLength: number;
    tabIndex: number;

    onBlur: () => void;
    onChange: (e: InputChangeEventHandler) => void;

    inputIsDirty?: boolean;
}

export type KeyboardEventType = React.KeyboardEvent<HTMLInputElement>
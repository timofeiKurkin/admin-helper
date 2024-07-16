import React, {HTMLInputTypeAttribute} from "react";
import {
    InputChangeEventHandler,
    KeyBoardEventHandler,
    TextareaChangeEventHandler
} from "@/app/(auxiliary)/types/AppTypes/AppTypes";

export interface InputPropsType<OnChangeType> {
    value: string;
    placeholder: string;
    type?: HTMLInputTypeAttribute;
    disabled?: boolean;
    maxLength: number;
    tabIndex: number;
    dynamicWidth?: boolean;

    datalist?: {
        listType: string;
        list: string[];
    };

    onBlur: () => void;
    onChange: (e: OnChangeType) => void;
    onKeyDown?: (e: KeyBoardEventHandler<HTMLInputElement>) => void

    inputIsDirty?: boolean;
}

export type KeyboardEventType = React.KeyboardEvent<HTMLInputElement>
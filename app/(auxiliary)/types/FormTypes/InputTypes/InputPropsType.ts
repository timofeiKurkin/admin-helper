import React, {HTMLInputTypeAttribute} from "react";
import {
    InputChangeEventHandler,
    KeyBoardEventHandler,
    TextareaChangeEventHandler
} from "@/app/(auxiliary)/types/AppTypes/AppTypes";
import {InputHelpfulItemType} from "@/app/(auxiliary)/types/Data/Interface/RootPage/RootPageContentType";

export interface InputPropsType<OnChangeType> {
    value: string;
    placeholder: string;
    type?: HTMLInputTypeAttribute;
    disabled?: boolean;
    maxLength: number;
    tabIndex: number;
    dynamicWidth?: boolean;

    onBlur: () => void;
    onChange: (e: OnChangeType) => void;
    onKeyDown?: (e: KeyBoardEventHandler<HTMLInputElement>) => void

    inputIsDirty?: boolean;
}

export interface InputWithDataListType<T> extends InputPropsType<T> {
    datalist?: {
        listType: string;
        list: InputHelpfulItemType[];
    };
}

export type KeyboardEventType = React.KeyboardEvent<HTMLInputElement>
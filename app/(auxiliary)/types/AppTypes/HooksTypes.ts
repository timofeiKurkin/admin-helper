import React from "react";

export interface ValidationsType {
    isEmpty: boolean,
    minLength: number,
    maxLength: number,
    phoneValidate?: boolean,
}

export interface ValidationsKeyType  {
    key: "device" | "name" | "phoneNumber" | "computerNumber" | string
}

export interface ValidationReturnDataType {
    isEmpty: boolean,
    minLength: boolean,
    maxLength: boolean,
    inputValid: boolean,

    minLengthError: string,
    maxLengthError: string,
    isEmptyError: string
}

export interface UseInputType extends ValidationReturnDataType{
    value: string,
    onChange(e: React.ChangeEvent<HTMLInputElement>): void,
    onBlur: () => void,
    isDirty: boolean,
    key: string,
}
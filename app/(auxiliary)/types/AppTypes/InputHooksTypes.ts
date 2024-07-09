import React from "react";

export interface ValidationsType {
    isEmpty: boolean;
    minLength: number;
    maxLength: number;
}

export interface ValidationsKeyType  {
    key: TypeOfInputs;
}

export type TypeOfInputs = "device" | "message" | PhotoAndVideoInputType | SavedInputsDataType;

export type PhotoAndVideoInputType = "photo" | "video" | string;

export type SavedInputsDataType = "name" | "company" | "number-pc" | "phone-number" | string;

export const savedInputsData: SavedInputsDataType[] = ["name", "company", "number-pc", "phone-number"]

export const photoAndVideoInputsData: PhotoAndVideoInputType[] = ["photo", "video"]

export interface ValidationReturnDataType {
    isEmpty: boolean;
    minLength: boolean;
    maxLength: boolean;
    inputValid: boolean;

    minLengthError: string;
    maxLengthError: string;
    isEmptyError: string;
}

export interface UseInputType extends ValidationReturnDataType{
    value: string;
    onChange(e: React.ChangeEvent<HTMLInputElement>): void;
    onBlur: () => void;
    isDirty: boolean;
    key: string;
}
import React from "react";
import {ChangeEventHandlerType} from "@/app/(auxiliary)/types/AppTypes/AppTypes";

export const DEVICE_KEY = "device"
export const MESSAGE_KEY = "message"
export const PHOTO_KEY = "photo"
export const VIDEO_KEY = "video"

export const NAME_KEY = "name"
export const PHONE_KEY = "phone-number"
export const COMPANY_KEY = "company"
export const NUMBERPC_KEY = "number-pc"


export interface ValidationsType {
    isEmpty: boolean;
    minLength: number;
    maxLength: number;
}

export interface ValidationsKeyType  {
    key: TypeOfInputs;
}

export type TypeOfInputs = DeviceType | PhotoAndVideoInputType | SavedInputsDataType;

export type PhotoAndVideoInputType = "photo" | "video";

export type DeviceType = "device";

export type SavedInputsDataType = "name" | "company" | "number-pc" | "phone-number" | "message" // | string;

export const savedInputsData: SavedInputsDataType[] = [
    "message",
    "name",
    "company",
    "number-pc",
    "phone-number"
]

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

export interface UseInputType<E> extends ValidationReturnDataType {
    value: string;
    onChange: (e: ChangeEventHandlerType<E>) => void;
    onBlur: () => void;
    isDirty: boolean;
    key: string;
}
import {ChangeEventHandlerType} from "@/app/(auxiliary)/types/AppTypes/AppTypes";

export const DEVICE_KEY = "device"
export const MESSAGE_KEY = "message"
export const PHOTO_KEY = "photo"
export const VIDEO_KEY = "video"

export const NAME_KEY = "name"
export const PHONE_KEY = "phone_number"
export const COMPANY_KEY = "company"
export const NUMBER_PC_KEY = "number_pc"


export interface ValidationsType {
    isEmpty: boolean;
    minLength: number;
    maxLength: number;
}

export interface ValidationsKeyType {
    key: AllKeysTypesOfInputs;
}

export type AllKeysTypesOfInputs = DeviceKeyType | PhotoAndVideoKeysTypes | SavedInputsKeysTypes;

export type PhotoAndVideoKeysTypes = typeof PHOTO_KEY | typeof VIDEO_KEY;

export type DeviceKeyType = typeof DEVICE_KEY;

export type SavedInputsKeysTypes = typeof NAME_KEY
    | typeof COMPANY_KEY
    | typeof NUMBER_PC_KEY
    | typeof PHONE_KEY
    | typeof MESSAGE_KEY;

export type TextInputsKeysTypes = SavedInputsKeysTypes | DeviceKeyType

export const savedInputsData: SavedInputsKeysTypes[] = [
    MESSAGE_KEY,
    NAME_KEY,
    PHONE_KEY,
    COMPANY_KEY,
    NUMBER_PC_KEY,
]

// export const photoAndVideoInputsData: PhotoAndVideoKeysTypes[] = [PHOTO_KEY, VIDEO_KEY]

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
    resetValue: () => void;
    isDirty: boolean;
    key: string;
}
import { ChangeEventHandlerType } from "@/app/(auxiliary)/types/AppTypes/AppTypes";

export const DEVICE_KEY = "device"
export const MESSAGE_KEY = "message"
export const PHOTO_KEY = "photo"
export const VIDEO_KEY = "video"

export const NAME_KEY = "name"
export const PHONE_KEY = "phone"
export const COMPANY_KEY = "company"
export const NUMBER_PC_KEY = "number_pc"
export const USER_POLITICAL = "user_political"

export type MessageInputDataType = "text" | "file"
export type CompanyInputDataType = "choose" | "write"

export const companyLocalData: { [key: string]: CompanyInputDataType } = {
    "0": "write",
    "1": "choose"
}

export interface ValidationsType {
    isEmpty: boolean;
    minLength: number;
    maxLength: number;
}

export interface ValidationsKeyType {
    key: TextInputsKeysType;
}

export type PhotoAndVideoKeysType = typeof PHOTO_KEY | typeof VIDEO_KEY;

export type DeviceKeyType = typeof DEVICE_KEY;

export type UserPoliticalType = typeof USER_POLITICAL;

export type MessageKeyType = typeof MESSAGE_KEY

export type SavedInputsKeysType = typeof NAME_KEY | typeof COMPANY_KEY | typeof NUMBER_PC_KEY | typeof PHONE_KEY; // | typeof MESSAGE_KEY;

export type TextInputsKeysType = SavedInputsKeysType | DeviceKeyType | MessageKeyType
export type AllKeysOfInputsType = PhotoAndVideoKeysType | TextInputsKeysType;

export const savedInputsData: SavedInputsKeysType[] = [
    NAME_KEY,
    PHONE_KEY,
    COMPANY_KEY,
    NUMBER_PC_KEY,
]

export const requiredFields: TextInputsKeysType[] = [
    MESSAGE_KEY,
    NAME_KEY,
    PHONE_KEY,
    COMPANY_KEY,
    NUMBER_PC_KEY,
    DEVICE_KEY
]

export type ValidateKeysType = TextInputsKeysType | UserPoliticalType; // Type for keys which validate all required inputs for validateStatus
export type ValidationKeysObject = { [key in ValidateKeysType]: string }

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

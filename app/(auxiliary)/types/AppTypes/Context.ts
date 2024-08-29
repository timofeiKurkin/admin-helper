import React from "react";
import {ContentOfUploadBlockType} from "@/app/(auxiliary)/types/Data/Interface/RootPage/RootPageContentType";
import {
    COMPANY_KEY,
    DEVICE_KEY,
    MESSAGE_KEY,
    NAME_KEY,
    NUMBER_PC_KEY,
    PHONE_KEY,
    PHOTO_KEY,
    VIDEO_KEY,
    PhotoAndVideoKeysTypes,
} from "@/app/(auxiliary)/types/AppTypes/InputHooksTypes";

export interface AppContextType {
    appState: ProviderStateType;
    setAppState: React.Dispatch<React.SetStateAction<ProviderStateType>>;
}

export interface FileListStateType {
    type: PhotoAndVideoKeysTypes;
    files: File[];
}

export interface FormDataItemType<T> {
    validationStatus: boolean;
    value: T;
}


export interface UserTextDataType {
    [DEVICE_KEY]: FormDataItemType<string>;
    [NAME_KEY]: FormDataItemType<string>;
    [MESSAGE_KEY]: FormDataItemType<string | File>;
    [COMPANY_KEY]: FormDataItemType<string>;
    [NUMBER_PC_KEY]: FormDataItemType<string>;
    [PHONE_KEY]: FormDataItemType<string>;
}

interface UserFileDataType {
    [PHOTO_KEY]: FileListStateType;
    [VIDEO_KEY]: FileListStateType;
}

export interface UserFormDataType {
    file_data: UserFileDataType;
    text_data: UserTextDataType;
}

// const MY_CONSTANT = 'MY_CONSTANT'
// const SOMETHING_ELSE = 'SOMETHING_ELSE'
// type MyType = typeof MY_CONSTANT | typeof SOMETHING_ELSE

interface UserDataKeysType {
    text_keys: {
        device_key: typeof DEVICE_KEY;
        name_key: typeof NAME_KEY;
        message_text_key: typeof MESSAGE_KEY;
        company_key: typeof COMPANY_KEY;
        number_pc_key: typeof NUMBER_PC_KEY;
        phone_key: typeof PHONE_KEY;
    },
    file_keys: {
        photo_key: typeof PHOTO_KEY;
        message_file_key: typeof MESSAGE_KEY,
        video_key: typeof VIDEO_KEY;
    }
}

// export const KEYS_OF_USER_FORM_DATA: UserDataKeysType = {
//     text_keys: {
//         device_key: DEVICE_KEY,
//         name_key: NAME_KEY,
//         message_text_key: MESSAGE_KEY,
//         company_key: COMPANY_KEY,
//         number_pc_key: NUMBER_PC_KEY,
//         phone_key: PHONE_KEY,
//     },
//     file_keys: {
//         photo_key: PHOTO_KEY,
//         message_file_key: MESSAGE_KEY,
//         video_key: VIDEO_KEY,
//     }
// }

export interface UserDeviceStateType {
    phoneAdaptive: boolean;
    padAdaptive: boolean;
    desktopAdaptive: boolean;
    padAdaptive640_992: boolean;
}

export interface PermissionsOfFormStatesType {
    userCanTalk: boolean;
    userAgreed: boolean;
}

export interface BlocksMovingType {
    openedPhotoBlock: boolean;
    openedVideoBlock: boolean;
    switchedMessageBlock: boolean;
}

export interface EditorStateType {
    currentFileIndex: number;
    currentFileName: string;
}

export interface ProviderStateType {
    userFormData?: UserFormDataType;
    permissionAgree?: PermissionsOfFormStatesType;
    userDevice?: UserDeviceStateType;
    rootPageContent?: {
        uploadFileContent: ContentOfUploadBlockType;
    };
    // photoList?: FileListStateType;
    // videoList?: FileListStateType;
    openedPhotoBlock?: boolean;
    openedVideoBlock?: boolean;
    switchedMessageBlock?: boolean;
    editorState?: EditorStateType;
}
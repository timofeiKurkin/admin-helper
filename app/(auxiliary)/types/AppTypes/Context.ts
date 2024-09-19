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
    PhotoAndVideoKeysTypes,
    VIDEO_KEY,
} from "@/app/(auxiliary)/types/AppTypes/InputHooksTypes";

export interface AppContextType {
    appState: ProviderStateType;
    setAppState: React.Dispatch<React.SetStateAction<ProviderStateType>>;
}

// export interface CustomFileType {
//     url: string;
//     name: string;
// }

// export interface FilePreviewType {
//     name: string;
//     link: string;
// }

export interface FileListStateType {
    type: PhotoAndVideoKeysTypes;
    filesNames: string[]; // Список имен файлов, доступных для открытия
    files: File[]; // Список исходных файлов, которые загрузил пользователь
    filesFinally: File[]; // Список файлов, прошедших изменения пользователя в фоторедакторе
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
    openedPhotoBlock?: boolean;
    openedVideoBlock?: boolean;
    switchedMessageBlock?: boolean;
    editorState?: EditorStateType;
}
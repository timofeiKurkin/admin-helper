import {
    MESSAGE_KEY,
    PHOTO_KEY,
    PhotoAndVideoKeysType,
    TextInputsKeysType,
    VIDEO_KEY
} from "@/app/(auxiliary)/types/AppTypes/InputHooksTypes";
import { ContentOfUploadBlockType } from "@/app/(auxiliary)/types/Data/Interface/RootPage/RootPageContentType";
import React from "react";


export interface AppContextType {
    appState: ProviderStateType;
    setAppState: React.Dispatch<React.SetStateAction<ProviderStateType>>;
}

export interface FileListStateType {
    type: PhotoAndVideoKeysType;
    filesNames: string[]; // Список имен файлов, доступных для открытия
    files: File[]; // Список исходных файлов, которые загрузил пользователь
    filesFinally: File[]; // Список файлов, прошедших изменения пользователя в фоторедакторе
}

export interface VoiceMessageFileType {
    validationStatus: boolean;
    // type: typeof MESSAGE_KEY;
    value: File;
}

export interface FormDataItemType<T> {
    validationStatus: boolean;
    value: T;
}


export type UserTextDataType = {
    [key in TextInputsKeysType]: FormDataItemType<string>;
}

interface UserFileDataType {
    [PHOTO_KEY]: FileListStateType;
    [VIDEO_KEY]: FileListStateType;
    [MESSAGE_KEY]: VoiceMessageFileType;
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

export interface PermissionsOfFormType {
    userCanTalk: boolean;
    userAgreedPolitical: boolean;
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
    permissionAgree?: PermissionsOfFormType;
    userDevice?: UserDeviceStateType;
    rootPageContent?: {
        uploadFileContent: ContentOfUploadBlockType;
    };
    openedPhotoBlock?: boolean;
    openedVideoBlock?: boolean;
    switchedMessageBlock?: boolean;
    editorState?: EditorStateType;
}

export interface ServerResponseType {
    status: "success" | "error" | "";
    sentToServer: boolean;
    message: string;
}
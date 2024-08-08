import React from "react";
import {UploadFileType} from "@/app/(auxiliary)/types/Data/Interface/RootPage/RootPageType";
import {
    COMPANY_KEY,
    DEVICE_KEY,
    MESSAGE_KEY,
    NAME_KEY, NUMBERPC_KEY, PHONE_KEY, PHOTO_KEY,
    PhotoAndVideoInputType, VIDEO_KEY
} from "@/app/(auxiliary)/types/AppTypes/InputHooksTypes";

export interface AppContextType {
    appState: ProviderStateType;
    setAppState: React.Dispatch<React.SetStateAction<ProviderStateType>>;
}

export interface FileListStateType {
    type?: PhotoAndVideoInputType;
    files: File[];
}

export interface FormDataItemType<T> {
    validationStatus: boolean;
    value: T;
}


export interface UserTextDataType {
    [DEVICE_KEY]?: FormDataItemType<string>;
    [NAME_KEY]?: FormDataItemType<string>;
    [MESSAGE_KEY]?: FormDataItemType<string | File>;
    [COMPANY_KEY]?: FormDataItemType<string>;
    [NUMBERPC_KEY]?: FormDataItemType<string>;
    [PHONE_KEY]?: FormDataItemType<string>;
}

export interface ProviderStateType {
    userDataFromForm?: {
        fileData?: {
            // [MESSAGE_KEY]?: File;
            [PHOTO_KEY]?: FileListStateType;
            [VIDEO_KEY]?: FileListStateType;
        };
        textData?: UserTextDataType;
    }
    permissionAgree?: {
        userCanTalk?: boolean;
        userAgreed?: boolean;
    }
    userDevice?: {
        phoneAdaptive: boolean;
        padAdaptive: boolean;
        desktopAdaptive: boolean;
        padAdaptive640_992: boolean;
    }
    rootPageContent?: {
        uploadFileContent: UploadFileType;
    }
    // photoList?: FileListStateType;
    // videoList?: FileListStateType;
    openedPhotoBlock?: boolean;
    openedVideoBlock?: boolean;
    switchedMessageBlock?: boolean;
}
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
    appState: StateType;
    setAppState: React.Dispatch<React.SetStateAction<StateType>>;
}

export interface FileListStateType {
    type?: PhotoAndVideoInputType;
    files: File[];
}

export interface StateType {
    userDataFromForm?: {
        fileData?: {
            [MESSAGE_KEY]?: File;
            [PHOTO_KEY]?: FileListStateType;
            [VIDEO_KEY]?: FileListStateType;
        };
        textData?: {
            [DEVICE_KEY]?: string;
            [NAME_KEY]?: string;
            [MESSAGE_KEY]?: string;
            [COMPANY_KEY]?: string;
            [NUMBERPC_KEY]?: string;
            [PHONE_KEY]?: string;
        }
    }
    permissionAgree?: {
        userCanTalk?: boolean;
        userAgreed?: boolean;
    }
    userDevice?: {
        phoneAdaptive: boolean;
        padAdaptive: boolean;
        desktopAdaptive: boolean;
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
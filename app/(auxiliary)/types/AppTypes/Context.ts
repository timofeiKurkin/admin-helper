import React from "react";
import {UploadFileType} from "@/app/(auxiliary)/types/Data/Interface/RootPage/RootPageType";
import {PhotoAndVideoInputType} from "@/app/(auxiliary)/types/AppTypes/InputHooksTypes";

export interface AppContextType {
    appState: StateType;
    setAppState: React.Dispatch<React.SetStateAction<StateType>>;
}

export interface FileListStateType {
    type?: PhotoAndVideoInputType;
    files: File[];
}

export interface StateType {
    userDevice?: {
        phoneAdaptive: boolean;
        padAdaptive: boolean;
        desktopAdaptive: boolean;
    }
    rootPageContent?: {
        uploadFileContent: UploadFileType;
    }
    photoList?: FileListStateType;
    videoList?: FileListStateType;
}
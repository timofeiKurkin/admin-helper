import React from "react";
import {UploadFileType} from "@/app/(auxiliary)/types/Data/Interface/RootPage/RootPageType";

export interface AppContextType {
    appState: StateType;
    setAppState: React.Dispatch<React.SetStateAction<StateType>>;
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
    photoList?: File[];
    videoList?: File[];
}
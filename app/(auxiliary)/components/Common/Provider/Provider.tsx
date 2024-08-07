"use client"

import React, {createContext, FC, useState} from 'react';
import {ChildrenType} from "@/app/(auxiliary)/types/AppTypes/AppTypes";
import {AppContextType, FileListStateType, StateType} from "@/app/(auxiliary)/types/AppTypes/Context";
import {UploadFileType} from "@/app/(auxiliary)/types/Data/Interface/RootPage/RootPageType";
import {
    COMPANY_KEY,
    DEVICE_KEY,
    MESSAGE_KEY, NAME_KEY,
    NUMBERPC_KEY, PHONE_KEY,
    PHOTO_KEY,
    VIDEO_KEY
} from "@/app/(auxiliary)/types/AppTypes/InputHooksTypes";


export const AppContext = createContext<AppContextType>({} as AppContextType)

const Provider: FC<ChildrenType> = ({children}) => {
    const [appState, setAppState] =
        useState<StateType>({
            userDataFromForm: {
                fileData: {
                    [MESSAGE_KEY]: {} as File,
                    [PHOTO_KEY]: {
                        type: "photo",
                        files: []
                    },
                    [VIDEO_KEY]: {
                        type: "video",
                        files: []
                    }
                },
                textData: {
                    [DEVICE_KEY]: "",
                    [NAME_KEY]: "",
                    [MESSAGE_KEY]: "",
                    [COMPANY_KEY]: "",
                    [NUMBERPC_KEY]: "",
                    [PHONE_KEY]: ""
                }
            },
            userDevice: {
                phoneAdaptive: false,
                padAdaptive: false,
                desktopAdaptive: false,
                padAdaptive640_992: false
            },
            rootPageContent: {
                uploadFileContent: {} as UploadFileType,
            },
            permissionAgree: {
                userCanTalk: false,
                userAgreed: false,
            },
            // photoList: {type: "photo", files: []},
            // videoList: {type: "video", files: []},
            openedPhotoBlock: false,
            openedVideoBlock: false,
            switchedMessageBlock: false
        })

    // console.log("appState", appState.userDataFromForm)

    return (
        <AppContext.Provider value={{appState, setAppState}}>
            {children}
        </AppContext.Provider>
    );
};

export default Provider;
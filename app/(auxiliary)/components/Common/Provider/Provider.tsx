"use client"

import React, {createContext, FC, useState} from 'react';
import {ChildrenType} from "@/app/(auxiliary)/types/AppTypes/AppTypes";
import {AppContextType, ProviderStateType} from "@/app/(auxiliary)/types/AppTypes/Context";
import {ContentOfUploadBlockType} from "@/app/(auxiliary)/types/Data/Interface/RootPage/RootPageContentType";
import {
    COMPANY_KEY,
    DEVICE_KEY,
    MESSAGE_KEY,
    NAME_KEY,
    NUMBER_PC_KEY,
    PHONE_KEY,
    PHOTO_KEY,
    VIDEO_KEY
} from "@/app/(auxiliary)/types/AppTypes/InputHooksTypes";


export const AppContext = createContext<AppContextType>({} as AppContextType)

const Provider: FC<ChildrenType> = ({children}) => {
    const [appState, setAppState] =
        useState<ProviderStateType>({
            // userFormData: {
            //     file_data: {
            //         // [MESSAGE_KEY]: {} as File,
            //         [PHOTO_KEY]: {
            //             type: "photo",
            //             files: []
            //         },
            //         [VIDEO_KEY]: {
            //             type: "video",
            //             files: []
            //         }
            //     },
            //     text_data: {
            //         [DEVICE_KEY]: {
            //             validationStatus: false,
            //             value: ""
            //         },
            //         [NAME_KEY]: {
            //             validationStatus: false,
            //             value: ""
            //         },
            //         [MESSAGE_KEY]: {
            //             validationStatus: false,
            //             value: ""
            //         },
            //         [COMPANY_KEY]: {
            //             validationStatus: false,
            //             value: ""
            //         },
            //         [NUMBER_PC_KEY]: {
            //             validationStatus: false,
            //             value: ""
            //         },
            //         [PHONE_KEY]: {
            //             validationStatus: false,
            //             value: ""
            //         }
            //     }
            // },
            // userDevice: {
            //     phoneAdaptive: false,
            //     padAdaptive: false,
            //     desktopAdaptive: false,
            //     padAdaptive640_992: false
            // },
            // rootPageContent: {
            //     uploadFileContent: {} as UploadFileType,
            // },
            permissionAgree: {
                userCanTalk: false,
                userAgreed: false,
            },
            // openedPhotoBlock: false,
            // openedVideoBlock: false,
            // switchedMessageBlock: false,
            // editorState: {
            //     currentFileIndex: 0,
            //     currentFileName: ""
            // }
        })

    // console.log("appState userDataFromForm: ", appState.userDataFromForm)

    return (
        <AppContext.Provider value={{appState, setAppState}}>
            {children}w
        </AppContext.Provider>
    );
};

export default Provider;
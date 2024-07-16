"use client"

import React, {createContext, FC, useState} from 'react';
import {ChildrenType} from "@/app/(auxiliary)/types/AppTypes/AppTypes";
import {AppContextType, StateType} from "@/app/(auxiliary)/types/AppTypes/Context";
import {UploadFileType} from "@/app/(auxiliary)/types/Data/Interface/RootPage/RootPageType";


export const AppContext = createContext<AppContextType>({} as AppContextType)

const Provider: FC<ChildrenType> = ({children}) => {
    const [appState, setAppState] = useState<StateType>({
        userDevice: {
            phoneAdaptive: false,
            padAdaptive: false,
            desktopAdaptive: false,
        },
        rootPageContent: {
            uploadFileContent: {} as UploadFileType,
        },
        photoList: [],
        videoList: []
    })

    return (
        <AppContext.Provider value={{ appState, setAppState }}>
            {children}
        </AppContext.Provider>
    );
};

export default Provider;
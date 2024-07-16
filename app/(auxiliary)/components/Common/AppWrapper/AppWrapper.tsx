"use client"

import {FC, useContext, useEffect} from 'react';
import {AppContext} from "@/app/(auxiliary)/components/Common/Provider/Provider";
import {ChildrenType} from "@/app/(auxiliary)/types/AppTypes/AppTypes";
import {useWindowSize} from "@/app/(auxiliary)/hooks/useWindowSize";
import RootPageData from "@/data/interface/root-page/data.json";
import {RootPageType} from "@/app/(auxiliary)/types/Data/Interface/RootPage/RootPageType";

const AppWrapper: FC<ChildrenType> = ({children}) => {
    const {appState, setAppState} = useContext(AppContext)
    const {width} = useWindowSize()
    const rootPageData: RootPageType = RootPageData

    useEffect(() => {
        if (rootPageData.uploadFile) {
            setAppState({
                ...appState,
                rootPageContent: {
                    uploadFileContent: rootPageData.uploadFile
                }
            })
        }
    }, [
        rootPageData,
        // appState,
        // setAppState
    ]);

    useEffect(() => {
        if (width) {
            if (width <= 639) {
                if (!appState.userDevice?.phoneAdaptive) {
                    setAppState({
                        ...appState,
                        userDevice: {
                            phoneAdaptive: true,
                            padAdaptive: false,
                            desktopAdaptive: false,
                        }
                    })
                }
            } else if (width >= 640 && width <= 1279) {
                if (!appState.userDevice?.padAdaptive) {
                    setAppState({
                        ...appState,
                        userDevice: {
                            phoneAdaptive: false,
                            padAdaptive: true,
                            desktopAdaptive: false,
                        }
                    })
                }
            } else if (width >= 1280) {
                if (!appState.userDevice?.desktopAdaptive) {
                    setAppState({
                        ...appState,
                        userDevice: {
                            phoneAdaptive: false,
                            padAdaptive: false,
                            desktopAdaptive: true,
                        }
                    })
                }
            }
        }
    }, [
        width,
        // appState,
        // setAppState,
        appState.userDevice?.desktopAdaptive,
        appState.userDevice?.padAdaptive,
        appState.userDevice?.phoneAdaptive,
    ]);

    return (children);
};

export default AppWrapper;
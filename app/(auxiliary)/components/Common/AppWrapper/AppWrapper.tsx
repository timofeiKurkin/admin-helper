"use client"

import React, {FC, useContext, useEffect} from 'react';
import {AppContext} from "@/app/(auxiliary)/components/Common/Provider/Provider";
import {ChildrenType} from "@/app/(auxiliary)/types/AppTypes/AppTypes";
import {useWindowSize} from "@/app/(auxiliary)/hooks/useWindowSize";

const AppWrapper: FC<ChildrenType> = ({children}) => {
    const {appState, setAppState} = useContext(AppContext)
    const {width} = useWindowSize()

    useEffect(() => {
        if(width) {
            if (width <= 639) {
                if (!appState.userDevice.phoneAdaptive) {
                    setAppState({
                        userDevice: {
                            phoneAdaptive: true,
                            padAdaptive: false,
                            desktopAdaptive: false,
                        }
                    })
                }
            } else if (width >= 640 && width <= 1279) {
                if (!appState.userDevice.padAdaptive) {
                    setAppState({
                        userDevice: {
                            phoneAdaptive: false,
                            padAdaptive: true,
                            desktopAdaptive: false,
                        }
                    })
                }
            } else if (width >= 1280) {
                if (!appState.userDevice.desktopAdaptive) {
                    setAppState({
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
        appState.userDevice.desktopAdaptive,
        appState.userDevice.padAdaptive,
        appState.userDevice.phoneAdaptive,
        setAppState
    ]);

    return (children);
};

export default AppWrapper;
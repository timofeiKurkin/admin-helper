"use client"
import React, {FC, PropsWithChildren, useEffect, useRef} from 'react';
import {Provider} from "react-redux";
import {AppStore, storeSetup} from "@/app/(auxiliary)/libs/redux-toolkit/store/storeSetup";
import {setupListeners} from "@reduxjs/toolkit/query";


const AppProvider: FC<PropsWithChildren> = (props) => {
    const storeRef = useRef<AppStore | null>(null)

    if(!storeRef.current) {
        storeRef.current = storeSetup()
    }

    useEffect(() => {
        if(storeRef.current !== null) {
            return setupListeners(storeRef.current.dispatch)
        }
    }, [])

    return <Provider store={storeRef.current}>{props.children}</Provider>;
};

export default AppProvider;
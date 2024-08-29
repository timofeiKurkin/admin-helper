"use client"

import {FC, useEffect} from 'react';
import {ChildrenType} from "@/app/(auxiliary)/types/AppTypes/AppTypes";
import {useWindowSize} from "@/app/(auxiliary)/hooks/useWindowSize";
import RootPageData from "@/data/interface/root-page/data.json";
import {RootPageContentType} from "@/app/(auxiliary)/types/Data/Interface/RootPage/RootPageContentType";
import axios from "axios";
import {getCSRFToken} from "@/app/(auxiliary)/func/getCSRFToken";
import {useAppDispatch, useAppSelector} from "@/app/(auxiliary)/libs/redux-toolkit/store/hooks";
import {
    selectUserDevice,
    setRootPageContent,
    setUserDevice
} from "@/app/(auxiliary)/libs/redux-toolkit/store/slices/AppSlice/AppSlice";

interface PropsType extends ChildrenType {
    CSRFToken: string;
}

const AppWrapper: FC<PropsType> = ({
                                       CSRFToken,
                                       children
                                   }) => {
    const dispatch = useAppDispatch()

    const {width} = useWindowSize()
    const rootPageData: RootPageContentType = RootPageData

    if (CSRFToken) {
        axios.defaults.headers.common['X-CSRFToken'] = CSRFToken
    }

    useEffect(() => {
        if (rootPageData.contentOfUploadBlock) {
            dispatch(setRootPageContent(rootPageData))
        }
    }, [
        dispatch,
        rootPageData,
    ])

    useEffect(() => {
        let active = true

        if (!CSRFToken) {
            getCSRFToken(active).then()
        } else {
            setInterval(() => getCSRFToken(active), 3600000)
        }

        return () => {
            active = false
        }
    }, [CSRFToken]);

    useEffect(() => {
        if (width) {
            dispatch(setUserDevice({width}))
        }
    }, [
        dispatch,
        width
    ])

    return (children);
};

export default AppWrapper;
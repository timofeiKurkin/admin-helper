"use client"

import {FC, useEffect} from 'react';
import {ChildrenType} from "@/app/(auxiliary)/types/AppTypes/AppTypes";
import {useWindowSize} from "@/app/(auxiliary)/hooks/useWindowSize";
import RootPageData from "@/data/interface/root-page/data.json";
import {RootPageContentType} from "@/app/(auxiliary)/types/Data/Interface/RootPage/RootPageContentType";
import {useAppDispatch} from "@/app/(auxiliary)/libs/redux-toolkit/store/hooks";
import {setRootPageContent, setUserDevice} from "@/app/(auxiliary)/libs/redux-toolkit/store/slices/AppSlice/AppSlice";


const AppWrapper: FC<ChildrenType> = ({
                                          children
                                      }) => {
    const dispatch = useAppDispatch()

    const {width} = useWindowSize()
    const rootPageData: RootPageContentType = RootPageData

    useEffect(() => {
        if (rootPageData.contentOfUploadBlock) {
            dispatch(setRootPageContent(rootPageData))
        }
    }, [
        dispatch,
        rootPageData,
    ])

    useEffect(() => {
        if (width) {
            dispatch(setUserDevice({width}))
        }
    }, [
        dispatch,
        width
    ])

    return children;
};

export default AppWrapper;
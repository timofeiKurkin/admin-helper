"use client"

import { useWindowSize } from "@/app/(auxiliary)/hooks/useWindowSize";
import { useAppDispatch } from "@/app/(auxiliary)/libs/redux-toolkit/store/hooks";
import { setUserDevice } from "@/app/(auxiliary)/libs/redux-toolkit/store/slices/AppSlice/AppSlice";
import { ChildrenProp } from "@/app/(auxiliary)/types/AppTypes/AppTypes";
import { FC, useEffect } from 'react';


const AppWrapper: FC<ChildrenProp> = ({
    children
}) => {
    const dispatch = useAppDispatch()

    const { width } = useWindowSize()

    useEffect(() => {
        if (width) {
            dispatch(setUserDevice({ width }))
        }
    }, [
        dispatch,
        width
    ])

    return children;
};

export default AppWrapper;
"use client"

import { useWindowSize } from "@/app/(auxiliary)/hooks/useWindowSize";
import { useAppDispatch } from "@/app/(auxiliary)/libs/redux-toolkit/store/hooks";
import { setUserDevice } from "@/app/(auxiliary)/libs/redux-toolkit/store/slices/AppSlice/AppSlice";
import { changeCompanyInputDataType } from "@/app/(auxiliary)/libs/redux-toolkit/store/slices/UserFormDataSlice/UserFormDataSlice";
import { ChildrenProp } from "@/app/(auxiliary)/types/AppTypes/AppTypes";
import { CompanyInputDataType, companyLocalData } from "@/app/(auxiliary)/types/AppTypes/InputHooksTypes";
import { FC, useEffect, useLayoutEffect } from 'react';


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

    useLayoutEffect(() => {
        const localData = localStorage.getItem("cidt") as "0" | "1" | null

        if (localData) {
            const companyInputDataType: CompanyInputDataType = companyLocalData[localData]
            dispatch(changeCompanyInputDataType(companyInputDataType))
        }
    }, [dispatch])

    return children;
};

export default AppWrapper;
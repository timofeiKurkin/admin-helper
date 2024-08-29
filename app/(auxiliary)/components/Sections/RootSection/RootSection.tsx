"use client"

import React, {useEffect} from 'react'
import MainTitleBlock from "@/app/(auxiliary)/components/Blocks/TitleBlocks/MainTitleBlock/MainTitleBlock";
import RootBodyBlock from "@/app/(auxiliary)/components/Blocks/RootBodyBlock/RootBodyBlock";
import TitleAndBodyWrapper from "@/app/(auxiliary)/components/UI/Wrappers/TitleAndBodyWrapper/TitleAndBodyWrapper";
import RootPageData from "@/data/interface/root-page/data.json";
import {RootPageContentType} from "@/app/(auxiliary)/types/Data/Interface/RootPage/RootPageContentType";
import {useAppDispatch, useAppSelector} from "@/app/(auxiliary)/libs/redux-toolkit/store/hooks";
import {
    selectRootPageContent,
    setRootPageContent
} from "@/app/(auxiliary)/libs/redux-toolkit/store/slices/AppSlice/AppSlice";

export default function RootSection() {
    const dispatch = useAppDispatch()
    const rootPageData: RootPageContentType = RootPageData
    const rootPageContent = useAppSelector(selectRootPageContent)

    useEffect(() => {
        dispatch(setRootPageContent(rootPageData))
    }, [
        dispatch,
        rootPageData
    ])

    if (Object.keys(rootPageContent).length) {
        return (
            <TitleAndBodyWrapper>
                <MainTitleBlock>{rootPageData.title}</MainTitleBlock>

                <RootBodyBlock/>
            </TitleAndBodyWrapper>
        )
    }
}

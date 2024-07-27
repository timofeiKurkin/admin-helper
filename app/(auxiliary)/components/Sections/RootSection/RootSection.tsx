import React from 'react'
import MainTitleBlock from "@/app/(auxiliary)/components/Blocks/TitleBlocks/MainTitleBlock/MainTitleBlock";
import RootBodyBlock from "@/app/(auxiliary)/components/Blocks/RootBodyBlock/RootBodyBlock";
import TitleAndBodyWrapper from "@/app/(auxiliary)/components/UI/Wrappers/TitleAndBodyWrapper/TitleAndBodyWrapper";
import RootPageData from "@/data/interface/root-page/data.json";
import {RootPageType} from "@/app/(auxiliary)/types/Data/Interface/RootPage/RootPageType";

export default function RootSection() {
    const rootPageData: RootPageType = RootPageData

    return (
        <TitleAndBodyWrapper>
            <MainTitleBlock>{rootPageData.title}</MainTitleBlock>

            <RootBodyBlock content={rootPageData}/>
        </TitleAndBodyWrapper>
    )
}

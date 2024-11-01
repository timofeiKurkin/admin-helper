"use client"

import RootBodyBlock from "@/app/(auxiliary)/components/Blocks/RootBodyBlock/RootBodyBlock";
import MainTitleBlock from "@/app/(auxiliary)/components/Blocks/TitleBlocks/MainTitleBlock/MainTitleBlock";
import TitleAndBodyWrapper from "@/app/(auxiliary)/components/UI/Wrappers/TitleAndBodyWrapper/TitleAndBodyWrapper";
import { RootPageContentType } from "@/app/(auxiliary)/types/Data/Interface/RootPage/RootPageContentType";
import RootPageData from "@/data/interface/root-page/data.json";
import UserRequestsBlock from '../../Blocks/UserRequestsBlock/UserRequestsBlock';
import { useAppSelector } from "@/app/(auxiliary)/libs/redux-toolkit/store/hooks";
import { selectUserDevice } from "@/app/(auxiliary)/libs/redux-toolkit/store/slices/AppSlice/AppSlice";

export default function RootSection() {
    const rootPageData: RootPageContentType = RootPageData
    const phoneAdaptive = useAppSelector(selectUserDevice).phoneAdaptive

    return (
        <TitleAndBodyWrapper>
            <MainTitleBlock>{rootPageData.title}</MainTitleBlock>
            {!phoneAdaptive ? <UserRequestsBlock /> : null}
            <RootBodyBlock rootPageContent={rootPageData} />
        </TitleAndBodyWrapper>
    )
}

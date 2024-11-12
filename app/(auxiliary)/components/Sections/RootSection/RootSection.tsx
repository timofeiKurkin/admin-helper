"use client"

import RootBodyBlock from "@/app/(auxiliary)/components/Blocks/RootBodyBlock/RootBodyBlock";
import MainTitleBlock from "@/app/(auxiliary)/components/Blocks/TitleBlocks/MainTitleBlock/MainTitleBlock";
import TitleAndBodyWrapper from "@/app/(auxiliary)/components/UI/Wrappers/TitleAndBodyWrapper/TitleAndBodyWrapper";
import { RootPageContentType } from "@/app/(auxiliary)/types/Data/Interface/RootPage/RootPageContentType";
import RootPageData from "@/data/interface/root-page/data.json";
import UserRequestsBlock from '../../Blocks/UserRequestsBlock/UserRequestsBlock';
import { useAppSelector } from "@/app/(auxiliary)/libs/redux-toolkit/store/hooks";
import { selectUserDevice } from "@/app/(auxiliary)/libs/redux-toolkit/store/slices/AppSlice/AppSlice";
import styles from "./RootSection.module.scss";

export default function RootSection() {
    const rootPageData = RootPageData as RootPageContentType
    const phoneAdaptive = useAppSelector(selectUserDevice).phoneAdaptive

    return (
        <TitleAndBodyWrapper>
            <MainTitleBlock>{rootPageData.title}</MainTitleBlock>
            <div className={styles.rootSectionUserRequest}>
                {!phoneAdaptive ? <UserRequestsBlock /> : null}
            </div>
            <RootBodyBlock rootPageContent={rootPageData} />
        </TitleAndBodyWrapper>
    )
}

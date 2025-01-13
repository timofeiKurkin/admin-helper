"use client"

import RootBodyBlock from "@/app/(auxiliary)/components/Blocks/RootBodyBlock/RootBodyBlock";
import MainTitleBlock from "@/app/(auxiliary)/components/Blocks/TitleBlocks/MainTitleBlock/MainTitleBlock";
import TitleAndBodyWrapper from "@/app/(auxiliary)/components/UI/Wrappers/TitleAndBodyWrapper/TitleAndBodyWrapper";
import { useAppSelector } from "@/app/(auxiliary)/libs/redux-toolkit/store/hooks";
import { selectUserDevice } from "@/app/(auxiliary)/libs/redux-toolkit/store/slices/AppSlice/AppSlice";
import { RootPageContentType } from "@/app/(auxiliary)/types/Data/Interface/RootPage/RootPageContentType";
import RootPageData from "@/data/interface/root-page/data.json";
import CheckLocalStorage from "../../Blocks/RootBodyBlock/CheckLocalStorage/CheckLocalStorage";
import ResetForm from "../../Blocks/RootBodyBlock/ResetForm/ResetForm";
import UserRequestsBlock from '../../Blocks/UserRequestsBlock/UserRequestsBlock';
import AuthorizeUser from "../../Common/AuthorizeUser/AuthorizeUser";
import styles from "./RootSection.module.scss";

export default function RootSection() {
    const rootPageData = RootPageData as RootPageContentType
    const phoneAdaptive = useAppSelector(selectUserDevice).phoneAdaptive

    return (
        <AuthorizeUser>
                <CheckLocalStorage>
                    <ResetForm>
                        <TitleAndBodyWrapper>
                            <MainTitleBlock>{rootPageData.title}</MainTitleBlock>
                            <div className={styles.rootSectionUserRequest}>
                                {!phoneAdaptive ? <UserRequestsBlock /> : null}
                            </div>
                            <RootBodyBlock rootPageContent={rootPageData} />
                        </TitleAndBodyWrapper>
                    </ResetForm>
                </CheckLocalStorage>
            </AuthorizeUser>
    )
}

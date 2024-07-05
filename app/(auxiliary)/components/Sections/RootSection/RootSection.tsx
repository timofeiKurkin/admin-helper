import React from 'react'
import styles from './RootSection.module.scss'
import mainTitleData from "@/data/interface/root-page/main-title/data.json";
import MainTitleBlock from "@/app/(auxiliary)/components/Blocks/MainTitleBlock/MainTitleBlock";

export default function RootSection() {

    return (
        <div className={styles.body}>
            <MainTitleBlock>{mainTitleData.mainTitle}</MainTitleBlock>
        </div>
    )
}

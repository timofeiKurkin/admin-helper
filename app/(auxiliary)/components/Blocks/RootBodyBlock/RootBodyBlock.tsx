"use client"

import React, {FC, useContext} from 'react';
import {RootPageType} from "@/app/(auxiliary)/types/Data/Interface/RootPage/RootPageType";
import FormPart from "@/app/(auxiliary)/components/Blocks/RootBodyBlock/FormPart/FormPart";
import styles from "./RootBodyBlock.module.scss"
import {AppContext} from "@/app/(auxiliary)/components/Common/Provider/Provider";


interface PropsType {
    content: RootPageType;
}

const RootBodyBlock: FC<PropsType> = ({content}) => {
    const {appState} = useContext(AppContext)
    // const type = appState.userDevice

    return (
        <div className={`${styles.bodyBlockGrid} ${(appState.openedPhotoBlock || appState.openedVideoBlock) && styles.openedFileBlock}`}>
            <FormPart inputsContent={content.formContent.formPartOne}/>

            <div className={`${styles.separatingLine}`}></div>

            <FormPart inputsContent={content.formContent.formPartTwo} permissionsContent={{
                permissions: content.permissionsContent,
                button: content.button,
            }}/>
        </div>
    );
};

export default RootBodyBlock;
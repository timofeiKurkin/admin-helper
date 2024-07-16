"use client"

import React, {FC} from 'react';
import {RootPageType} from "@/app/(auxiliary)/types/Data/Interface/RootPage/RootPageType";
import FormPart from "@/app/(auxiliary)/components/Blocks/RootBodyBlock/FormPart/FormPart";
import styles from "./RootBodyBlock.module.scss"


interface PropsType {
    content: RootPageType;
}

const RootBodyBlock: FC<PropsType> = ({content}) => {

    return (
        <div className={styles.bodyBlockGrid}>
            <FormPart inputsContent={content.formContent.formPartOne}/>

            <div className={styles.separatingLineLess}></div>

            <FormPart inputsContent={content.formContent.formPartTwo} permissionsContent={{
                permissions: content.permissionsContent,
                button: content.button,
            }}/>
        </div>
    );
};

export default RootBodyBlock;
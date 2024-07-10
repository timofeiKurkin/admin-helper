"use client"

import React, {FC} from 'react';
import {RootPageType} from "@/app/(auxiliary)/types/Data/Interface/RootPage/RootPageType";
import FormPart from "@/app/(auxiliary)/components/Blocks/RootBodyBlock/FormPart/FormPart";
import styles from "./RootBodyBlock.module.scss"
import Permissions from "@/app/(auxiliary)/components/Blocks/RootBodyBlock/Permissions/Permissions";
import Button from "@/app/(auxiliary)/components/UI/Button/Button";


interface PropsType {
    content: RootPageType;
}

const RootBodyBlock: FC<PropsType> = ({content}) => {

    return (
        <div className={styles.bodyBlockGrid}>
            <FormPart content={content.formContent.formPartOne}/>

            <div className={styles.separatingLineLess}></div>

            <FormPart content={content.formContent.formPartTwo}/>

            <div className={styles.permissionsAndSend}>
                <div className={styles.permissions}>
                    <Permissions permissionsContent={content.permissionsContent}/>
                </div>

                <div className={styles.send}>
                    <Button disabled={true}>
                        {content.button}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default RootBodyBlock;
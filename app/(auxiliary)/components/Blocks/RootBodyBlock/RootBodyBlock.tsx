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
            <FormPart content={content.formContent.formPartOne}/>

            <div className={styles.separatingLine}></div>

            <FormPart content={content.formContent.formPartTwo}/>
        </div>
    );
};

export default RootBodyBlock;
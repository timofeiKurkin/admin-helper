import React, {FC} from 'react';
import {RootPageType} from "@/app/(auxiliary)/types/Data/Interface/RootPage/RootPageType";
import FormPartOne from "@/app/(auxiliary)/components/Blocks/RootBodyBlock/FormPartOne/FormPartOne";
import FormPartTwo from "@/app/(auxiliary)/components/Blocks/RootBodyBlock/FormPartTwo/FormPartTwo";
import styles from "./RootBodyBlock.module.scss"


interface PropsType {
    content: RootPageType;
}

const RootBodyBlock: FC<PropsType> = ({content}) => {

    return (
        <div className={styles.bodyBlockGrid}>
            <FormPartOne content={content.formContent.formPartOne}/>

            <div className={styles.separatingLine}></div>

            <FormPartTwo content={content.formContent.formPartTwo}/>
        </div>
    );
};

export default RootBodyBlock;
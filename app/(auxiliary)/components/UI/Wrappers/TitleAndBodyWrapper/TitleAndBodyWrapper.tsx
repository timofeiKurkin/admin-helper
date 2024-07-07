import React, {FC} from 'react';
import {ChildrenType} from "@/app/(auxiliary)/types/AppTypes/AppTypes";
import styles from "./TitleAndBodyWrapper.module.scss"

const TitleAndBodyWrapper: FC<ChildrenType> = ({children}) => {
    return (
        <div className={styles.titleAndBodyWrapper}>
            {children}
        </div>
    );
};

export default TitleAndBodyWrapper;
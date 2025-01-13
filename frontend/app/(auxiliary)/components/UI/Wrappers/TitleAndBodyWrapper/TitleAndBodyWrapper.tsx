import React, { FC } from 'react';
import { ChildrenProp } from "@/app/(auxiliary)/types/AppTypes/AppTypes";
import styles from "./TitleAndBodyWrapper.module.scss"

const TitleAndBodyWrapper: FC<ChildrenProp> = ({ children }) => {
    return (
        <div className={styles.titleAndBodyWrapper}>
            {children}
        </div>
    );
};

export default TitleAndBodyWrapper;
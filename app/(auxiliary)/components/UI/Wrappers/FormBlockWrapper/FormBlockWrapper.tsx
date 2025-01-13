import React, { FC } from 'react';
import styles from "./FormBlockWrapper.module.scss";
import { ChildrenProp } from "@/app/(auxiliary)/types/AppTypes/AppTypes";

const FormBlockWrapper: FC<ChildrenProp> = ({ children }) => {
    return (
        <div className={styles.formBlockWrapper}>{children}</div>
    );
};

export default FormBlockWrapper;
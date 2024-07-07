import React, {FC} from 'react';
import styles from "./FormBlockWrapper.module.scss";
import {ChildrenType} from "@/app/(auxiliary)/types/AppTypes/AppTypes";

const FormBlockWrapper: FC<ChildrenType> = ({children}) => {
    return (
        <div className={styles.formBlockWrapper}>{children}</div>
    );
};

export default FormBlockWrapper;
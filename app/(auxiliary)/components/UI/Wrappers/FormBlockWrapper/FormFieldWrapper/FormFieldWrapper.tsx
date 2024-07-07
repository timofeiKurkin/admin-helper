import React, {FC} from 'react';
import {ChildrenType} from "@/app/(auxiliary)/types/AppTypes/AppTypes";
import styles from "./FormFieldWrapper.module.scss";

const FormFieldWrapper: FC<ChildrenType> = ({children}) => {
    return (
        <div className={styles.formFieldWrapper}>
            {children}
        </div>
    );
};

export default FormFieldWrapper;
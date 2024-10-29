import React, { FC } from 'react';
import { ChildrenProp } from "@/app/(auxiliary)/types/AppTypes/AppTypes";
import styles from "./FormFieldWrapper.module.scss";

const FormFieldWrapper: FC<ChildrenProp> = ({ children }) => {
    return (
        <div className={styles.formFieldWrapper}>
            {children}
        </div>
    );
};

export default FormFieldWrapper;
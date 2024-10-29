import React, { FC } from 'react';
import styles from "./Backdrop.module.scss"
import { ChildrenProp } from "@/app/(auxiliary)/types/AppTypes/AppTypes";

interface PropsType extends ChildrenProp {
    onBackdropClick?: () => void;
}

const Backdrop: FC<PropsType> = ({
    children,
    onBackdropClick
}) => {
    const backDropHandler = () => {
        if (onBackdropClick) {
            onBackdropClick()
        }
    }

    return (
        <div className={styles.backdropWrapper} onClick={backDropHandler}>
            <div className={styles.backdropBody}>
                {children}
            </div>
        </div>
    );
};

export default Backdrop;
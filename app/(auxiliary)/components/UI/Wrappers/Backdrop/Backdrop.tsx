import React, {FC} from 'react';
import styles from "./Backdrop.module.scss"
import {ChildrenType} from "@/app/(auxiliary)/types/AppTypes/AppTypes";

interface PropsType extends ChildrenType {
    onBackdropClick?: () => void;
}

const Backdrop: FC<PropsType> = ({
                                     children,
                                     onBackdropClick
                                 }) => {
    return (
        <div className={styles.backdropWrapper} onClick={(e) => {
            e.stopPropagation()
            if (onBackdropClick) {
                onBackdropClick()
            }
        }}>
            <div className={styles.backdropBody}>
                {children}
            </div>
        </div>
    );
};

export default Backdrop;
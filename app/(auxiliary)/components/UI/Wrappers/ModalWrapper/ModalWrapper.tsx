import { ChildrenProp } from '@/app/(auxiliary)/types/AppTypes/AppTypes'
import React, { FC } from 'react'
import styles from "./ModalWrapper.module.scss";

const ModalWrapper: FC<ChildrenProp> = ({ children }) => {
    return (
        <div className={styles.modalWrapper}>{children}</div>
    )
}

export default ModalWrapper
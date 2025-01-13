import React, { FC, useEffect } from 'react';
import styles from "@/app/(auxiliary)/components/Blocks/FormBlock/DropZone/DropZone.module.scss";
import { GetInputPropsType } from "@/app/(auxiliary)/types/FormTypes/DropZoneTypes/DropZoneTypes";

interface PropsType {
    getInputProps: GetInputPropsType;
    dragDropZoneIsOpen: boolean;
    inputRef: React.RefObject<HTMLInputElement>;
}

const MobileDropZone: FC<PropsType> = ({
    getInputProps,
    dragDropZoneIsOpen,
    inputRef
}) => {

    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.click()
        }
    }, [
        dragDropZoneIsOpen,
        inputRef,
    ]);

    return (
        <input {...getInputProps({})}
            className={styles.dropInput} />
    );
};

export default MobileDropZone;
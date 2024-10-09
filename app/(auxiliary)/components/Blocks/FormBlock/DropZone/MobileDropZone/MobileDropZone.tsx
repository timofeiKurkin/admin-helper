import React, {FC} from 'react';
import styles from "@/app/(auxiliary)/components/Blocks/FormBlock/DropZone/DropZone.module.scss";
import {GetInputPropsType} from "@/app/(auxiliary)/types/DropZoneTypes/DropZoneTypes";

interface PropsType {
    getInputProps: GetInputPropsType;
}

const MobileDropZone: FC<PropsType> = ({getInputProps}) => {
    return (
        <input {...getInputProps({})}
               className={styles.dropInput}/>
    );
};

export default MobileDropZone;
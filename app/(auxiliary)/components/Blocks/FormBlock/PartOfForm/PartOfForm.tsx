import React, {FC} from 'react';
import {useAppSelector} from "@/app/(auxiliary)/libs/redux-toolkit/store/hooks";
import {
    selectBlocksMoving,
    selectUserDevice
} from "@/app/(auxiliary)/libs/redux-toolkit/store/slices/AppSlice/AppSlice";
import styles from "@/app/(auxiliary)/components/Blocks/FormBlock/FormBlock.module.scss";
import CoupleOfInputs from "@/app/(auxiliary)/components/Blocks/FormBlock/CoupleOfInputs/CoupleOfInputs";


interface FormComponentsProps {
    formPartNumber: number;
    partOfInputsOne: any;
    partOfInputsTwo: any;
}

const PartOfForm: FC<FormComponentsProps> = ({
                                                 formPartNumber,
                                                 partOfInputsOne,
                                                 partOfInputsTwo
                                             }) => {
    const userDevice = useAppSelector(selectUserDevice)
    const blocksMoving = useAppSelector(selectBlocksMoving)

    const columnGapStatus = (userDevice.padAdaptive640_992 && !formPartNumber) ? blocksMoving.openedPhotoBlock : blocksMoving.switchedMessageBlock

    return (
        <div
            className={`${styles.formBlockWrapper} ${formPartNumber ? styles.formBlockPartTwoWrapper : styles.formBlockPartOneWrapper} ${columnGapStatus && styles.formBlockPartOneActiveWrapper}`}>
            <CoupleOfInputs contentOfInputs={partOfInputsOne}/>
            <CoupleOfInputs contentOfInputs={partOfInputsTwo}/>
        </div>
    )
};

export default PartOfForm;
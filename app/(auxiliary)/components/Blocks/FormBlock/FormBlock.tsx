"use client"

import React, {FC, useEffect, useState} from 'react';
import {AllTypesOfInputsArray} from "@/app/(auxiliary)/types/Data/Interface/RootPage/RootPageContentType";
import CoupleOfInputs from "@/app/(auxiliary)/components/Blocks/FormBlock/CoupleOfInputs/CoupleOfInputs";
import styles from "./FormBlock.module.scss";
import {useAppSelector} from "@/app/(auxiliary)/libs/redux-toolkit/store/hooks";
import {
    selectBlocksMoving,
    selectUserDevice
} from "@/app/(auxiliary)/libs/redux-toolkit/store/slices/AppSlice/AppSlice";

interface FormComponentsProps {
    formPartNumber: number;
    partOfInputsOne: any;
    partOfInputsTwo: any;
}

const FormComponents: FC<FormComponentsProps> = ({
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
}


interface PropsType {
    inputContent: AllTypesOfInputsArray;
    formPartNumber: number;
}

const FormBlock: FC<PropsType> = ({
                                      inputContent,
                                      formPartNumber
                                  }) => {
    const userDevice = useAppSelector(selectUserDevice)
    const [partOfInputsOne, setPartOfInputsOne] =
        useState(() => inputContent.slice(0, 2))
    const [partOfInputsTwo, setPartOfInputsTwo] =
        useState(() => inputContent.slice(2, 5))

    useEffect(() => {
        if (!formPartNumber && (userDevice.padAdaptive)) {
            setPartOfInputsOne([inputContent[0], inputContent[2]])
            setPartOfInputsTwo([inputContent[1], inputContent[3]])
        }

        if(formPartNumber && (userDevice.phoneAdaptive)) {
            setPartOfInputsOne([inputContent[0], inputContent[2]])
            setPartOfInputsTwo([inputContent[1], inputContent[3]])
        }
    }, [
        userDevice.padAdaptive,
        userDevice.phoneAdaptive,
        formPartNumber,
        inputContent
    ])

    return <FormComponents formPartNumber={formPartNumber}
                           partOfInputsOne={partOfInputsOne}
                           partOfInputsTwo={partOfInputsTwo}/>;
};

export default FormBlock;
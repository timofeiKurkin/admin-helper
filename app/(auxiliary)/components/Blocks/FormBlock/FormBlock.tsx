"use client"

import React, {FC, useContext, useEffect, useState} from 'react';
import {AllTypesOfInputsArray} from "@/app/(auxiliary)/types/Data/Interface/RootPage/RootPageType";
import CoupleOfInputs from "@/app/(auxiliary)/components/Blocks/FormBlock/CoupleOfInputs/CoupleOfInputs";
import styles from "./FormBlock.module.scss";
import {AppContext} from "@/app/(auxiliary)/components/Common/Provider/Provider";

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
    const {appState} = useContext(AppContext)

    const columnGapStatus = (appState.userDevice?.padAdaptive640_992 && !formPartNumber) ? appState.openedPhotoBlock : appState.switchedMessageBlock

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
    const {appState} = useContext(AppContext)
    const [partOfInputsOne, setPartOfInputsOne] =
        useState(() => inputContent.slice(0, 2))
    const [partOfInputsTwo, setPartOfInputsTwo] =
        useState(() => inputContent.slice(2, 5))

    useEffect(() => {
        if (!formPartNumber && (appState.userDevice?.padAdaptive)) {
            setPartOfInputsOne([inputContent[0], inputContent[2]])
            setPartOfInputsTwo([inputContent[1], inputContent[3]])
        }

        if(formPartNumber && (appState.userDevice?.phoneAdaptive)) {
            setPartOfInputsOne([inputContent[0], inputContent[2]])
            setPartOfInputsTwo([inputContent[1], inputContent[3]])
        }
    }, [
        appState.userDevice?.padAdaptive,
        appState.userDevice?.phoneAdaptive,
        formPartNumber,
        inputContent
    ])

    return <FormComponents formPartNumber={formPartNumber}
                           partOfInputsOne={partOfInputsOne}
                           partOfInputsTwo={partOfInputsTwo}/>;
};

export default FormBlock;
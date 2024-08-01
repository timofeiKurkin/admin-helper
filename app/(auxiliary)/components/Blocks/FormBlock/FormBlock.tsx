"use client"

import React, {FC, useContext, useEffect, useState} from 'react';
import {AllTypesOfInputsArray} from "@/app/(auxiliary)/types/Data/Interface/RootPage/RootPageType";
import CoupleOfInputs from "@/app/(auxiliary)/components/Blocks/FormBlock/CoupleOfInputs/CoupleOfInputs";
import styles from "./FormBlock.module.scss";
import {AppContext} from "@/app/(auxiliary)/components/Common/Provider/Provider";

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

    // const partOfInputsOne = inputContent.slice(0, 2)
    // const partOfInputsTwo = inputContent.slice(2, 5)

    useEffect(() => {
        if(!formPartNumber && (appState.userDevice?.padAdaptive || appState.userDevice?.phoneAdaptive)) {
            setPartOfInputsOne([inputContent[0], inputContent[2]])
            setPartOfInputsTwo([inputContent[1], inputContent[3]])
        }
    }, [
        appState.userDevice?.padAdaptive,
        appState.userDevice?.phoneAdaptive,
        formPartNumber,
        inputContent
    ])

    return (
        <div
            className={`${styles.formBlockWrapper} ${formPartNumber ? styles.formBlockPartTwoWrapper : styles.formBlockPartOneWrapper} ${(appState.switchedMessageBlock && !formPartNumber) && styles.formBlockPartOneActiveWrapper} ${formPartNumber && styles.formBlockPartTwoActiveWrapper}`}>
            <CoupleOfInputs contentOfInputs={partOfInputsOne}/>
            <CoupleOfInputs contentOfInputs={partOfInputsTwo}/>
        </div>
    );
};

export default FormBlock;
"use client"

import React, {FC, useContext} from 'react';
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
    const partOfInputsOne = inputContent.slice(0, 2)
    const partOfInputsTwo = inputContent.slice(2, 5)

    return (
        <div
            className={`${styles.formBlockWrapper} ${formPartNumber ? styles.formBlockPartTwoWrapper : styles.formBlockPartOneWrapper} ${(appState.switchedMessageBlock && !formPartNumber) && styles.formBlockPartOneActiveWrapper} ${formPartNumber && styles.formBlockPartTwoActiveWrapper}`}>
            <CoupleOfInputs contentOfInputs={partOfInputsOne}/>
            <CoupleOfInputs contentOfInputs={partOfInputsTwo}/>
        </div>
    );
};

export default FormBlock;
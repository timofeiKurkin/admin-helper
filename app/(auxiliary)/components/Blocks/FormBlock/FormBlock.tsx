"use client"

import React, {FC} from 'react';
import {AllTypesOfInputsArray} from "@/app/(auxiliary)/types/Data/Interface/RootPage/RootPageType";
import CoupleOfInputs from "@/app/(auxiliary)/components/Blocks/FormBlock/CoupleOfInputs/CoupleOfInputs";
import styles from "./FormBlock.module.scss";

interface PropsType {
    inputContent: AllTypesOfInputsArray;
    formPartNumber: number;
}

const FormBlock: FC<PropsType> = ({
                                      inputContent,
                                      formPartNumber
                                  }) => {
    const partOfInputsOne = inputContent.slice(0, 2)
    const partOfInputsTwo = inputContent.slice(2, 5)

    return (
        <div
            className={`${styles.formBlockWrapper} ${formPartNumber ? styles.formBlockPartTwoWrapper : styles.formBlockPartOneWrapper}`}>
            <CoupleOfInputs contentOfInputs={partOfInputsOne}/>
            <CoupleOfInputs contentOfInputs={partOfInputsTwo}/>
        </div>
    );
};

export default FormBlock;
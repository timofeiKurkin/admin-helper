import React, { FC } from 'react';
import { AllTypesOfInputsArray } from "@/app/(auxiliary)/types/Data/Interface/RootPage/RootPageContentType";
import styles from "./CoupleOfInputs.module.scss"
import CurrentInput from "@/app/(auxiliary)/components/Blocks/FormBlock/CoupleOfInputs/CurrentInput/CurrentInput";

interface PropsType {
    contentOfInputs: AllTypesOfInputsArray;
}

const CoupleOfInputs: FC<PropsType> = ({ contentOfInputs }) => {

    return (
        <div className={styles.coupleOfInputsWrapper}>
            {contentOfInputs.map((currentInput) => (
                <CurrentInput key={`key=${currentInput.type}`}
                    currentInput={currentInput} />
            ))}
        </div>
    );
};

export default CoupleOfInputs;
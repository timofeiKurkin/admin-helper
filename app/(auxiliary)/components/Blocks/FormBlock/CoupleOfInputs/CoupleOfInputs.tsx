import React, { FC } from 'react';
import { AllTypesOfInputsArray } from "@/app/(auxiliary)/types/Data/Interface/RootPage/RootPageContentType";
import styles from "./CoupleOfInputs.module.scss"
import CurrentInput from "@/app/(auxiliary)/components/Blocks/FormBlock/CoupleOfInputs/CurrentInput/CurrentInput";
import { div } from 'framer-motion/client';
import { AllKeysOfInputsType } from '@/app/(auxiliary)/types/AppTypes/InputHooksTypes';

interface PropsType {
    contentOfInputs: AllTypesOfInputsArray;
}

const classNames: { [key in AllKeysOfInputsType]: string } = {
    "device": styles.device,
    "message": styles.message,
    "photo": styles.photo,
    "video": styles.video,

    "company": styles.company,
    "name": styles.name,
    "phone": styles.phoneAndPcNumber,
    "number_pc": styles.phoneAndPcNumber,
}


const CoupleOfInputs: FC<PropsType> = ({ contentOfInputs }) => {
    return (
        <div className={styles.coupleOfInputsWrapper}>
            {contentOfInputs.map((currentInput) => (
                <div key={`key=${currentInput.type}`} className={classNames[currentInput.type]}>
                    <CurrentInput currentInput={currentInput} />
                </div>
            ))}
        </div>
    );
};

export default CoupleOfInputs;
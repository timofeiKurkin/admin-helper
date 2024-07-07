import React, {FC} from 'react';
import {InputType} from "@/app/(auxiliary)/types/Data/Interface/RootPage/RootPageType";
import CoupleOfInputs from "@/app/(auxiliary)/components/Blocks/FormBlock/CoupleOfInputs/CoupleOfInputs";

interface PropsType {
    inputContent: InputType[];
}

const FormBlock: FC<PropsType> = ({inputContent}) => {


    return (
        <div>
            <CoupleOfInputs contentOfInputs={[inputContent.slice(0, 2)]}/>
        </div>
    );
};

export default FormBlock;
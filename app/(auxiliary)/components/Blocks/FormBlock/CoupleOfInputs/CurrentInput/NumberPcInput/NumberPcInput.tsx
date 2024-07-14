import React from 'react';
import {InputChangeEventHandler} from "@/app/(auxiliary)/types/AppTypes/AppTypes";

const NumberPcInput = () => {

    const numberPcHandler = (e: InputChangeEventHandler) => {
        e.target.value = e.target.value.replace(/\D/g, '')

    }

    return (
        <div>

        </div>
    );
};

export default NumberPcInput;
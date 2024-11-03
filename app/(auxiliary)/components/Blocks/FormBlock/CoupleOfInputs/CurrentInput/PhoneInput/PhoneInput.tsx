import React, { FC, useEffect } from 'react';
import { InputChangeEventHandler } from "@/app/(auxiliary)/types/AppTypes/AppTypes";
import Input from "@/app/(auxiliary)/components/UI/Inputs/Input/Input";
import useInput from "@/app/(auxiliary)/hooks/useInput";
import {
    inputValidations
} from "@/app/(auxiliary)/components/Blocks/FormBlock/CoupleOfInputs/CurrentInput/inputValidations";
import inputsStyles
    from "@/app/(auxiliary)/components/Blocks/FormBlock/CoupleOfInputs/CurrentInput/InputsStyles.module.scss";
import { PhoneNumberInputType } from "@/app/(auxiliary)/types/Data/Interface/RootPage/RootPageContentType";
import {
    inputHandleKeyDown
} from "@/app/(auxiliary)/components/Blocks/FormBlock/CoupleOfInputs/CurrentInput/inputHandleKeyDown";
import { useAppDispatch } from "@/app/(auxiliary)/libs/redux-toolkit/store/hooks";
import { changeTextData } from "@/app/(auxiliary)/libs/redux-toolkit/store/slices/UserFormDataSlice/UserFormDataSlice";
import { PHONE_KEY } from "@/app/(auxiliary)/types/AppTypes/InputHooksTypes";
import dynamic from 'next/dynamic';
import InputLoadingSkeleton from '@/app/(auxiliary)/components/UI/Loaders/InputLoadingSkeleton/InputLoadingSkeleton';

interface PropsType {
    currentInput: PhoneNumberInputType;
}

const LazyInput = dynamic(
    () => import("@/app/(auxiliary)/components/UI/Inputs/Input/Input"),
    {
        ssr: false,
        loading: () => <InputLoadingSkeleton />
    }
)

const PhoneInput: FC<PropsType> = ({ currentInput }) => {
    const dispatch = useAppDispatch()
    const value = useInput("+7 ", currentInput.type, inputValidations[currentInput.type])

    const phoneRegularExpression = (e: InputChangeEventHandler) => {
        e.target.value = e.target.value.replace(/\D/g, '')
        let formattedValue = "+7 "

        if (e.target.value.length > 1) {
            formattedValue += e.target.value.slice(1, 4);
        }
        if (e.target.value.length >= 4) {
            formattedValue += ' ' + e.target.value.slice(4, 7);
        }
        if (e.target.value.length >= 7) {
            formattedValue += ' - ' + e.target.value.slice(7, 9);
        }
        if (e.target.value.length >= 9) {
            formattedValue += ' - ' + e.target.value.slice(9, 11);
        }

        e.target.value = formattedValue

        value.onChange(e)
    }

    useEffect(() => {
        dispatch(changeTextData({
            key: currentInput.type,
            data: {
                validationStatus: value.inputValid,
                value: value.value
            }
        }))
    }, [dispatch, value.inputValid, value.value]);

    return (
        <div className={inputsStyles.phoneNumberInputWrapper}>
            <LazyInput
                value={(value.isDirty || value.value.length >= 4) ? value.value : ""}
                onBlur={value.onBlur}
                type={"tel"}
                placeholder={currentInput.inputPlaceholder || ""}
                tabIndex={1}
                onKeyDown={(e) => inputHandleKeyDown(e, value)}
                maxLength={inputValidations[currentInput.type].maxLength}
                inputIsDirty={value.isDirty}
                dynamicWidth={true}
                onChange={phoneRegularExpression} />
        </div>
    );
};

export default PhoneInput;
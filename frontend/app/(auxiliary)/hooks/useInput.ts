import {
    ChangeEventHandlerType,
    InputChangeEventHandler,
    TextareaChangeEventHandler
} from "@/app/(auxiliary)/types/AppTypes/AppTypes";
import {
    savedInputsData, SavedInputsKeysType,
    UseInputType,
    ValidationReturnDataType,
    ValidationsKeyType,
    ValidationsType
} from "@/app/(auxiliary)/types/AppTypes/InputHooksTypes";
import { useState } from "react";
import useLocalStorage from "./useLocalStorage";
import useValidation from "./useValidation";

const UseInput = <E>(
    initialValue: string,
    key: ValidationsKeyType['key'],
    validations: ValidationsType
): UseInputType<E> => {
    const [value, setValue] = useLocalStorage(key, initialValue)

    const [isDirty, setDirty] = useState<boolean>(false)
    const formValid: ValidationReturnDataType = useValidation(value, validations, key)

    const onChange = (e: ChangeEventHandlerType<E>) => {
        setValue((e as InputChangeEventHandler | TextareaChangeEventHandler).target.value)
    }

    const onBlur = () => {
        setDirty((prev) => (!prev))
    }

    const resetValue = () => {
        if (savedInputsData.includes(key as SavedInputsKeysType)) return
        setValue("")
    }

    return {
        value,
        onChange,
        onBlur,
        resetValue,
        isDirty,
        ...formValid,
        key,
    }
};

export default UseInput;
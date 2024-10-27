import {useState} from "react";
import useValidation from "./useValidation";
import useLocalStorage from "./useLocalStorage";
import {
    MESSAGE_KEY,
    savedInputsData, SavedInputsKeysType,
    UseInputType,
    ValidationReturnDataType,
    ValidationsKeyType,
    ValidationsType
} from "@/app/(auxiliary)/types/AppTypes/InputHooksTypes";
import {
    ChangeEventHandlerType,
    InputChangeEventHandler,
    TextareaChangeEventHandler
} from "@/app/(auxiliary)/types/AppTypes/AppTypes";

const UseInput = <E>(
    initialValue: string,
    key: ValidationsKeyType['key'],
    validations: ValidationsType
): UseInputType<E> => {
    const [value, setValue] = useLocalStorage(key, initialValue)

    const [isDirty, setDirty] = useState<boolean>(false)
    const formValid: ValidationReturnDataType = useValidation(value, validations)

    const onChange = (e: ChangeEventHandlerType<E>) => {
        setValue((e as InputChangeEventHandler | TextareaChangeEventHandler).target.value)
    }

    const onBlur = () => {
        setDirty((prev) => (!prev))
    }

    const resetValue = () => {
        if(!(key === MESSAGE_KEY) && savedInputsData.includes(key as SavedInputsKeysType)) return
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
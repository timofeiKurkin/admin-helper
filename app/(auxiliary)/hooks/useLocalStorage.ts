import {useEffect, useState} from "react";
import {
    AllKeysOfInputsType,
    savedInputsData,
    SavedInputsKeysType
} from "@/app/(auxiliary)/types/AppTypes/InputHooksTypes";

const UseLocalStorage = (
    key: AllKeysOfInputsType,
    initialValue: string | boolean | {}
) => {
    const getStorageValue = (key: SavedInputsKeysType, initialValue: string | number | {} | boolean) => {
        if (typeof window !== 'undefined') {
            const value: any = localStorage.getItem(key)
            const parse = JSON.parse(value)
            return parse || initialValue
        }

        return initialValue
    }

    const [value, setValue] = useState(() => {
        if (savedInputsData.includes(key as SavedInputsKeysType)) {
            return getStorageValue(key as SavedInputsKeysType, initialValue)
        }
        return initialValue
    })

    useEffect(() => {
        if (savedInputsData.includes(key as SavedInputsKeysType)) {
            localStorage.setItem(key, JSON.stringify(value))
        }
    }, [key, value])

    return [value, setValue]
};

export default UseLocalStorage;
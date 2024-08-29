import {useEffect, useState} from "react";
import {
    AllKeysTypesOfInputs,
    savedInputsData,
    SavedInputsKeysTypes
} from "@/app/(auxiliary)/types/AppTypes/InputHooksTypes";

const UseLocalStorage = (key: AllKeysTypesOfInputs, initialValue: string | boolean | {}) => {
    // const filtered

    const getStorageValue = (key: SavedInputsKeysTypes, initialValue: string | number | {} | boolean) => {
        if (typeof window !== 'undefined') {
            const value: any = localStorage.getItem(key)
            const parse = JSON.parse(value)
            return parse || initialValue
        }

        return initialValue
    }

    const [value, setValue] = useState(() => {
        if (savedInputsData.includes(key)) {
            return getStorageValue(key, initialValue)
        }
        return initialValue
    })

    useEffect(() => {
        if (savedInputsData.includes(key)) {
            localStorage.setItem(key, JSON.stringify(value))
        }
    }, [key, value])

    return [value, setValue]
};

export default UseLocalStorage;
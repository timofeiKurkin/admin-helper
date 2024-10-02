import {
    COMPANY_KEY,
    DEVICE_KEY,
    MESSAGE_KEY,
    NAME_KEY, NUMBER_PC_KEY, PHONE_KEY,
    ValidationsType
} from "@/app/(auxiliary)/types/AppTypes/InputHooksTypes";

export const inputValidations: { [key: string]: ValidationsType } = {
    [DEVICE_KEY]: {
        isEmpty: true,
        maxLength: 18,
        minLength: 2
    },
    [MESSAGE_KEY]: {
        isEmpty: true,
        maxLength: 100,
        minLength: 10
    },
    // "photo": {
    //     isEmpty: true,
    //     maxLength: 0,
    //     minLength: 0
    // },
    // "video": {
    //     isEmpty: true,
    //     maxLength: 0,
    //     minLength: 0
    // },
    [NAME_KEY]: {
        isEmpty: true,
        maxLength: 16,
        minLength: 2
    },
    [COMPANY_KEY]: {
        isEmpty: true,
        maxLength: 24,
        minLength: 3
    },
    [PHONE_KEY]: {
        isEmpty: true,
        maxLength: 20,
        minLength: 20
    },
    [NUMBER_PC_KEY]: {
        isEmpty: true,
        maxLength: 11,
        minLength: 11
    },
}
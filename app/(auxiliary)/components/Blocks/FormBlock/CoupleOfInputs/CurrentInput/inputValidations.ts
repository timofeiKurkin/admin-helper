import {ValidationsType} from "@/app/(auxiliary)/types/AppTypes/InputHooksTypes";

export const inputValidations: { [key: string]: ValidationsType } = {
    "device": {
        isEmpty: true,
        maxLength: 18,
        minLength: 2
    },
    "message": {
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
    "name": {
        isEmpty: true,
        maxLength: 16,
        minLength: 5
    },
    "company": {
        isEmpty: true,
        maxLength: 24,
        minLength: 3
    },
    "phone-number": {
        isEmpty: true,
        maxLength: 20,
        minLength: 3
    },
    "number-pc": {
        isEmpty: true,
        maxLength: 11,
        minLength: 11
    },
}
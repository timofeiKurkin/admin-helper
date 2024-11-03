import { ValidateKeysType } from "@/app/(auxiliary)/types/AppTypes/InputHooksTypes";

export const inputsNameError: { [key in ValidateKeysType]: string } = {
    "company": "Организация",
    "device": "Устройство",
    "message": "Сообщение",
    "name": "Имя",
    "number_pc": "Номер компьютера",
    "phone": "Номер телефона",
    "user_political": ""
}
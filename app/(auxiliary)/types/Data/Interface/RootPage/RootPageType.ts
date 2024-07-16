// Form body
import {TypeOfInputs} from "@/app/(auxiliary)/types/AppTypes/InputHooksTypes";

export interface RootPageType {
    title: string;
    formContent: FormContentType;
    permissionsContent: PermissionsContentType;
    button: string;
}

export interface FormContentType {
    formPartOne: FormPartType;
    formPartTwo: FormPartType;
}

export interface FormPartType {
    title: string;
    formPartNumber: number;
    inputs: AllTypesOfInputsArray;
}


// Inputs
export interface InputType {
    id: number;
    type: TypeOfInputs;
    inputTitle: string;
    inputPlaceholder?: string;
    toggleText?: string;
    button?: string;
}

export interface DeviceInputType extends InputType {
    helpfulList: string[];
}

export interface MessageInputType extends InputType {
    voiceMessage?: MessageType;
    textMessage?: MessageType;
}

export interface PhotoAndVideoInputType extends InputType {
}

export interface NameInputType extends InputType {
}

export interface CompanyInputType extends InputType {
    helpfulList: string[];
}

export interface PhoneNumberInputType extends InputType {
}

export interface NumberPcInputType extends InputType {
}

export type AllTypesOfInputsArray = AllTypesOfInputs[]
export type AllTypesOfInputs = (DeviceInputType & MessageInputType | PhotoAndVideoInputType | NameInputType & PhoneNumberInputType | CompanyInputType & NumberPcInputType)


// Data for inputs

export interface MessageType {
    inputPlaceholder: string;
}


// Permissions
export interface PermissionsContentType {
    ICanAnswer: string;
    personalDataPreparation: string;
    preparationLinkToPolicy: string;
}

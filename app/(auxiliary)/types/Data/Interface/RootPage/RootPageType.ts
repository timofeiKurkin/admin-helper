// Form body
import {TypeOfInputs} from "@/app/(auxiliary)/types/AppTypes/InputHooksTypes";

export interface RootPageType extends Button {
    title: string;
    formContent: FormContentType;
    uploadFile: UploadFileType;
    permissionsContent: PermissionsContentType;
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
    // button?: string;
}

export interface DeviceInputType extends InputType {
    helpfulList: string[];
}

export interface MessageInputType extends InputType {
    voiceMessage?: MessageType;
    textMessage?: MessageType;
}

export interface PhotoAndVideoInputType extends InputType, Button {
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

export interface Button {
    button: string;
}


// Upload File Type
export interface UploadFileType extends Button {
    uploadPhoto: string;
    uploadVideo: string;
    isDragContent: string;
    image: {
        static: string;
        isDrag: string;
    }
}

// Permissions
export interface PermissionsContentType {
    ICanAnswer: string;
    personalDataPreparation: string;
    preparationLinkToPolicy: string;
}

// Form body
import {
    COMPANY_KEY,
    DEVICE_KEY,
    MESSAGE_KEY,
    NAME_KEY,
    NUMBER_PC_KEY,
    PHONE_KEY,
    PhotoAndVideoKeysTypes,
    AllKeysTypesOfInputs
} from "@/app/(auxiliary)/types/AppTypes/InputHooksTypes";

export interface RootPageContentType extends Button {
    title: string;
    formContent: FormContentType;
    contentOfUploadBlock: ContentOfUploadBlockType;
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
    // type: AllKeysTypesOfInputs; // TODO: REMOVE STRING TYPE
    inputTitle: string;
    inputPlaceholder?: string;
    toggleText?: string;
    // button?: string;
}

export interface DeviceInputType extends InputType {
    type: typeof DEVICE_KEY;
    helpfulList: InputHelpfulItemType[];
}

export interface MessageInputType extends InputType {
    type: typeof MESSAGE_KEY;
    voiceMessage?: MessageType;
    textMessage?: MessageType;
}

export interface PhotoAndVideoInputType extends InputType, Button {
    type: PhotoAndVideoKeysTypes;
}

export interface NameInputType extends InputType {
    type: typeof NAME_KEY;
}

export interface CompanyInputType extends InputType {
    type: typeof COMPANY_KEY;
    helpfulList: InputHelpfulItemType[];
}

export interface PhoneNumberInputType extends InputType {
    type: typeof PHONE_KEY;
}

export interface NumberPcInputType extends InputType {
    type: typeof NUMBER_PC_KEY;
}

export type AllTypesOfInputsArray = AllTypesOfInputs[]
export type AllTypesOfInputs = (DeviceInputType & MessageInputType | PhotoAndVideoInputType | NameInputType & PhoneNumberInputType | CompanyInputType & NumberPcInputType)


// Data for inputs
export interface MessageType {
    inputPlaceholder: string;
}

export interface Button {
    button?: string;
}

export interface InputHelpfulItemType {
    id: number;
    title: string;
    keys: string[]
}


// Upload File Type
export interface ContentOfUploadBlockType extends Button {
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

// Form body
export interface RootPageType {
    title: string;
    formContent: FormContentType;
    permissionsContent: PermissionsContent;
    button: string;
}

export interface FormContentType {
    formPartOne: FormPartOneType;
    formPartTwo: FormPartTwoTypeType;
}

export interface FormPartOneType {
    title: string;
    inputs: InputType[];
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
    devicesList?: DevicesListType[];
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
    listOfCompanies?: string[];
}

export interface PhoneNumberInputType extends InputType {
}

export interface NumberPcInputType extends InputType {
}

export type AllTypesOfInputs = [DeviceInputType & MessageInputType | PhotoAndVideoInputType | NameInputType & PhoneNumberInputType | CompanyInputType & NumberPcInputType][]


// Data for inputs
export type TypeOfInputs = "device" | "message" | "photo" | "video" | "name" | "company" | "phone-number" | "number-pc"

export interface DevicesListType {
    id: number;
    title: string;
}

export interface MessageType {
    inputPlaceholder: string;
}

export interface FormPartTwoTypeType {
    title: string;
    inputs: InputType[];
}


// Permissions
export interface PermissionsContent {
    ICanAnswer: string;
    personalDataPreparation: string;
    preparationLinkToPolicy: string;
}

import { CsrfTokenType } from "../AppTypes/AppTypes";

export interface RequestHeaderPropsType {
    isCompleted: boolean;
    id: number;
}

export interface RequestBodyPropsType {
    phone: string;
    company: string;
    name: string;
    device: string
    completedAt: string;
    createdAt: string;
}

export interface HelpRequestForOperatorType extends RequestHeaderPropsType, RequestBodyPropsType {
}

export interface CompletedHelpRequestType extends CsrfTokenType {
    helpRequest: HelpRequestForOperatorType;
}

export type RequestBodyKeysType = [
    "phone" |
    "company" |
    "name" |
    "device" |
    "completedAt" |
    "createdAt"
]

export interface RequestBodyItemType { text: string; value: string }

export interface DeleteRequestType {
    message: string;
}
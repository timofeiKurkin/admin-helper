import { RequestBodyPropsType } from "../../../OperatorTypes/OperatorTypes";

export interface CompleteRequestDataType {
    header: HeaderRequestType;
    body: BodyRequestType;
    helpfulText: string;
}

export interface HeaderRequestType {
    title: string;
    request: string;
    status: StatusRequestType;
}

export interface BodyRequestType {
    commonInfo: string;
    itemsInfo: ItemsInfoRequestType;
}

export interface ItemsInfoRequestType extends RequestBodyPropsType {
}

export interface StatusRequestType {
    statusTitle: string;
    completed: string;
    uncompleted: string;
}
import {CsrfTokenType} from "../AppTypes/AppTypes";
import {HelpRequestItemType} from "../UserRequestsTypes/UserRequestsTypes";
import {AxiosResponse} from "axios";

// export interface CSRFTokenResponseType {
//     csrf_token: string;
// }

export type AxiosErrorType = { message: string; status: number };
export type UnknownError = { error: Error; message: string; status: number };
export type AsyncAxiosResponse<D> = Promise<AxiosResponse<D>>

export interface ResponseFromServerType extends CsrfTokenType {
    message: string
}

export interface CreatedHelpRequestType extends ResponseFromServerType {
    new_request: HelpRequestItemType;
}

export interface AuthorizeUserResponseType {
    authorized: boolean;
}
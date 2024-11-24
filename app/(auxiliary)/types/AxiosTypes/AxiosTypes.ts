import { CsrfTokenType } from "../AppTypes/AppTypes";
import { HelpRequestItemType } from "../UserRequestsTypes/UserRequestsTypes";

export interface CSRFTokenResponseType {
    csrf_token: string;
}

export type AxiosErrorType = { message: string, statusCode: number };
export type UnknownError = { error: Error; message: string };

export interface ResponseFromServerType extends CsrfTokenType { message: string }

export interface CreatedHelpRequestType {
    message: string;
    new_request: HelpRequestItemType;
}

export interface AuthorizeUserResponseType {
    authorized: boolean;
}

export interface CSRFTokenResponseType {
    csrf_token: string;
}

export type AxiosErrorType = {message: string, statusCode: number};
export type UnknownError = {error: Error; message: string};

export type ResponseFromServerType = {id: number; message: string}

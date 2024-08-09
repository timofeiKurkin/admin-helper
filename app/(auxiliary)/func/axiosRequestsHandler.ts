import {AxiosResponse, isAxiosError} from "axios";
import {AxiosErrorType, UnknownError} from "@/app/(auxiliary)/types/AxiosTypes/AxiosTypes";

export const axiosRequestsHandler = async <T, D>(axiosFunction: T): Promise<AxiosResponse<D> | AxiosErrorType | UnknownError> => {
    try {
        return await axiosFunction as Promise<AxiosResponse<D>>
    } catch (error: unknown) {
        if(isAxiosError(error)) {
            return {
                message: error.response?.data || error.message,
                statusCode: error.response?.status || 500
            }
        } else {
            return {
                error: (error as Error),
                message: "Unknown Error"
            }
        }
    }
}
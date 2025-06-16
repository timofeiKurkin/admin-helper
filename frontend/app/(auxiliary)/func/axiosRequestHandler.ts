import {AxiosResponse, isAxiosError} from "axios";
import {AsyncAxiosResponse, AxiosErrorType, UnknownError} from "@/app/(auxiliary)/types/AxiosTypes/AxiosTypes";

export type AxiosResponseHandler<D> = Promise<AxiosResponse<D> | AxiosErrorType | UnknownError>

export const axiosRequestHandler = async <D>(func: () => AsyncAxiosResponse<D>): AxiosResponseHandler<D> => {
    try {
        return await func()
    } catch (error: unknown) {
        if (isAxiosError(error)) {
            return {
                message: error.response?.data.message || error.message || "Ошибка запроса",
                status: error.response?.status || 500
            } as AxiosErrorType
        } else {
            return {
                error: error as Error,
                message: "Неизвестная ошибка",
                status: 500
            }
        }
    }
}
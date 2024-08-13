import {axiosRequestsHandler} from "@/app/(auxiliary)/func/axiosRequestsHandler";
import AppService from "@/app/(auxiliary)/libs/axios/services/AppService/AppService";
import axios, {AxiosResponse} from "axios";
import {CSRFTokenResponseType} from "@/app/(auxiliary)/types/AxiosTypes/AxiosTypes";

export const getCSRFToken = async (active: boolean) => {
    const response = await axiosRequestsHandler(AppService.getCSRFToken())

    if (active) {
        if ((response as AxiosResponse<CSRFTokenResponseType>).status === 200) {
            axios.defaults.headers.common['X-CSRFToken'] = (response as AxiosResponse<CSRFTokenResponseType>).data.csrf_token
        }
    }
}
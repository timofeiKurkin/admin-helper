import { $api } from "@/app/(auxiliary)/libs/axios";
import { CreatedHelpRequestType } from "@/app/(auxiliary)/types/AxiosTypes/AxiosTypes";
import { UserRequestListType } from "@/app/(auxiliary)/types/UserRequestsTypes/UserRequestsTypes";
import { AxiosResponse } from "axios";


export default class HelpUserService {
    static rootPage = "help_request/"

    static async requestClassification(data: FormData): Promise<AxiosResponse<CreatedHelpRequestType>> {
        return $api.post<CreatedHelpRequestType>(`${this.rootPage}create_request`, data, {
            maxBodyLength: Infinity,
            headers: {
                // 'Content-Type': 'multipart/form-data',
                // 'Content-Type': 'application/x-www-form-urlencoded',
            }
        })
    }

    static async getUserRequests(): Promise<AxiosResponse<UserRequestListType>> {
        return $api.get<UserRequestListType>(`${this.rootPage}get_user_requests`)
    }
}
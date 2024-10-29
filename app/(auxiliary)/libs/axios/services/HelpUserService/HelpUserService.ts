import { AxiosResponse } from "axios";
import { $api } from "@/app/(auxiliary)/libs/axios";
import { CreatedHelpRequestType } from "@/app/(auxiliary)/types/AxiosTypes/AxiosTypes";
import { HelpRequestItemType, UserRequestListType } from "@/app/(auxiliary)/types/UserRequestsTypes/UserRequestsTypes";


export default class HelpUserService {
    static rootPage = "help_request/"

    static async requestClassification(data: FormData): Promise<AxiosResponse<CreatedHelpRequestType>> {
        return $api.post<CreatedHelpRequestType>(`${this.rootPage}create_request`, data)
    }

    static async getUserRequests(): Promise<AxiosResponse<UserRequestListType>> {
        return $api.get<UserRequestListType>(`${this.rootPage}get_user_requests`)
    }
}
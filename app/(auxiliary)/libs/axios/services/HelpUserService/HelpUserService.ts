import {AxiosResponse} from "axios";
import {$api} from "@/app/(auxiliary)/libs/axios";
import {UserDataForSendToServerType} from "@/app/(auxiliary)/types/AppTypes/Context";


export default class HelpUserService {
    static rootPage = "help_user/"

    static async requestClassification(data: FormData): Promise<AxiosResponse<any>> {
        return $api.post<any>(`${this.rootPage}request_classification/`, data)
    }
}
import {AxiosResponse} from "axios";
import {$api} from "@/app/(auxiliary)/libs/axios";


export default class HelpUserService {
    static rootPage = "help_user/"

    static async requestClassification(data: FormData): Promise<AxiosResponse<any>> {
        return $api.post<any>(`${this.rootPage}request_classification/`, data)
    }
}
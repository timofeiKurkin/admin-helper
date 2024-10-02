import {AxiosResponse} from "axios";
import {$api} from "@/app/(auxiliary)/libs/axios";


export default class HelpUserService {
    static rootPage = "api/"

    static async requestClassification(data: FormData): Promise<AxiosResponse<any>> {
        return $api.post<any>(`${this.rootPage}users_requests_for_help`, data)
    }
}
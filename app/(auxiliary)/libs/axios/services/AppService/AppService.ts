import {AxiosResponse} from "axios";
import {$api} from "@/app/(auxiliary)/libs/axios";


export default class AppService {
    static rootPage = "client_settings/"

    static async getCSRFToken(): Promise<AxiosResponse> {
        return $api.get(`${this.rootPage}get-csrf-token/`)
    }
}
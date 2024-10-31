import { HelpRequestForOperatorType } from "@/app/(auxiliary)/types/OperatorTypes/OperatorTypes";
import { AxiosResponse } from "axios";
import { $api } from "../../index";

export default class OperatorService {
    static rootPage = "operator/"

    static async complete_request(acceptUrl: string): Promise<AxiosResponse<HelpRequestForOperatorType>> {
        return $api.patch<HelpRequestForOperatorType>(`${this.rootPage}complete_request/${acceptUrl}`)
    }
}
import { DeleteRequestType, HelpRequestForOperatorType } from "@/app/(auxiliary)/types/OperatorTypes/OperatorTypes";
import { AxiosResponse } from "axios";
import { $api } from "../../index";

export default class OperatorService {
    static rootPage = "operator/"

    static async complete_request(acceptUrl: string, csrfToken: string): Promise<AxiosResponse<HelpRequestForOperatorType>> {
        return $api.patch<HelpRequestForOperatorType>(`${this.rootPage}complete_request/${acceptUrl}`, {
            headers: {
                "X-CSRF-Token": csrfToken
            }
        })
    }

    static async delete_request(acceptURL: string, csrfToken: string): Promise<AxiosResponse<DeleteRequestType>> {
        return $api.delete<DeleteRequestType>(`${this.rootPage}delete_request/${acceptURL}`, {
            headers: {
                "X-CSRF-Token": csrfToken
            }
        })
    }
}
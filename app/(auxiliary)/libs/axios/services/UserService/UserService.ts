import { AxiosResponse } from "axios";
import { $api } from "../..";
import { AuthorizeUserResponseType } from "@/app/(auxiliary)/types/AxiosTypes/AxiosTypes";
import { CsrfTokenType } from "@/app/(auxiliary)/types/AppTypes/AppTypes";

export default class UserService {
    static rootPage = "user/"

    static async authorizeUser(): Promise<AxiosResponse<AuthorizeUserResponseType>> {
        return $api.get<AuthorizeUserResponseType>(`${this.rootPage}auth`)
    }

    static async getCsrfToken(): Promise<AxiosResponse<CsrfTokenType>> {
        return $api.get<CsrfTokenType>(`${this.rootPage}csrf_token`)
    }
}
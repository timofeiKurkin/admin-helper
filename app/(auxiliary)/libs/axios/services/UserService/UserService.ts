import { AxiosResponse } from "axios";
import { $api } from "../..";
import { AuthorizeUserResponseType } from "@/app/(auxiliary)/types/AxiosTypes/AxiosTypes";

export default class UserService {
    static rootPage = "user/"

    static async authorizeUser(): Promise<AxiosResponse<AuthorizeUserResponseType>> {
        return $api.get<AuthorizeUserResponseType>(`${this.rootPage}auth/`)
    }
}
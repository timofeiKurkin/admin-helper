export interface HelpRequestItemType {
    id: number;
    createdAt: string;
    completedAt: string;
    isCompleted: boolean
}
export type UserRequestListType = HelpRequestItemType[];

// export interface GetUsersRequestsResponse {
//     requests: UserRequestListType;
//     has_more: boolean;
// }

export interface UserRequestsStateType {
    requestsModalIsOpen: boolean;
    userRequests: UserRequestListType;
    userIsAuthorized: boolean;
}
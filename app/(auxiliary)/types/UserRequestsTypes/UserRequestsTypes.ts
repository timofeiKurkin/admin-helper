export interface HelpRequestItemType {
    id: number;
    createdAt: string;
    isCompleted: boolean
}
export type UserRequestListType = HelpRequestItemType[];

export interface UserRequestsStateType {
    requestsModalIsOpen: boolean;
    userRequests: UserRequestListType;
    userIsAuthorized: boolean;
}
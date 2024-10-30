export interface HelpRequestItemType {
    id: number;
    created_at: string;
    is_completed: boolean
}
export type UserRequestListType = HelpRequestItemType[];

export interface UserRequestsStateType {
    requestsModalIsOpen: boolean;
    userRequests: UserRequestListType;
    userIsAuthorized: boolean;
}
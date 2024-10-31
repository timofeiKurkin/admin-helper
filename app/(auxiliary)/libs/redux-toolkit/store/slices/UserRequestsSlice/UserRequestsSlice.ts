import { HelpRequestItemType, UserRequestListType, UserRequestsStateType } from "@/app/(auxiliary)/types/UserRequestsTypes/UserRequestsTypes";
import { createAppSlice } from "../../createAppSlice";
import { PayloadAction } from "@reduxjs/toolkit";

const initialState: UserRequestsStateType = {
    userRequests: [],
    requestsModalIsOpen: false,
    userIsAuthorized: false
}

export const userRequestsSlice = createAppSlice({
    name: "userRequests",
    initialState,
    reducers: (create) => ({
        setUserAuthorization: create.reducer((state, action: PayloadAction<boolean>) => {
            state.userIsAuthorized = action.payload
        }),
        changeRequestsModalVisibility: create.reducer((state) => {
            state.requestsModalIsOpen = !state.requestsModalIsOpen
        }),
        setUserRequests: create.reducer((state, action: PayloadAction<HelpRequestItemType | UserRequestListType>) => {
            if (Array.isArray(action.payload)) {
                state.userRequests = action.payload
            } else {
                state.userRequests.push(action.payload)
            }
        }),
        addUserRequest: create.reducer((state, action: PayloadAction<HelpRequestItemType>) => {
            state.userRequests.push(action.payload)
        }),
        changeUserRequestStatus: create.reducer((state, action: PayloadAction<HelpRequestItemType>) => {
            state.userRequests = state.userRequests.map((request) => {
                if (request.id === action.payload.id && !request.isCompleted) {
                    return {
                        ...request,
                        isCompleted: !request.isCompleted
                    }
                }
                return request
            })
        }),
        deleteUserRequest: create.reducer((state, action: PayloadAction<HelpRequestItemType>) => {
            state.userRequests = state.userRequests.filter(item => item.id !== action.payload.id)
        })
    }),
    selectors: {
        selectRequestsModalIsOpen: (state) => state.requestsModalIsOpen,
        selectUserRequests: (state) => state.userRequests,
        selectUserIsAuthorized: (state) => state.userIsAuthorized
    }
})

export const {
    setUserAuthorization,
    changeRequestsModalVisibility,
    setUserRequests,
    addUserRequest,
    changeUserRequestStatus,
    deleteUserRequest,
} = userRequestsSlice.actions
export const { selectRequestsModalIsOpen, selectUserRequests, selectUserIsAuthorized } = userRequestsSlice.selectors
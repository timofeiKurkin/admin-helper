import { createAppSlice } from "@/app/(auxiliary)/libs/redux-toolkit/store/createAppSlice";
import { CsrfTokenType } from "@/app/(auxiliary)/types/AppTypes/AppTypes";
import { BlocksMovingType, UserDeviceStateType } from "@/app/(auxiliary)/types/AppTypes/ContextTypes";
import { DeleteNotificationType, NotificationListType, SetNotificationType } from "@/app/(auxiliary)/types/AppTypes/NotificationTypes";
import { PayloadAction } from "@reduxjs/toolkit";
import { v4 as uuidv4 } from "uuid";


interface InitialStateType {
    userDevice: UserDeviceStateType;
    blocksMoving: BlocksMovingType;
    notificationList: NotificationListType;
    disableFormInputs: boolean;
    csrfToken: string;
    cookiePermission: boolean
}

const initialState: InitialStateType = {
    blocksMoving: {
        openedPhotoBlock: false,
        openedVideoBlock: false,
        switchedMessageBlock: false,
    },
    userDevice: {
        phoneAdaptive: false,
        padAdaptive: false,
        desktopAdaptive: false,
        padAdaptive640_992: false,
    },
    notificationList: [],
    disableFormInputs: false,
    csrfToken: "",
    cookiePermission: false,

}

export const appSlice = createAppSlice({
    name: "app",
    initialState,
    reducers: (create) => ({
        setUserDevice: create.reducer(
            (
                state,
                action: PayloadAction<{ width: number }>
            ) => {
                if (action.payload.width <= 639) {
                    if (!state.userDevice.phoneAdaptive) {
                        state.userDevice = {
                            ...initialState.userDevice,
                            phoneAdaptive: true
                        }
                    }
                } else if (action.payload.width >= 640 && action.payload.width <= 1279) {
                    if (action.payload.width >= 640 && action.payload.width <= 991) {
                        if (!state.userDevice.padAdaptive640_992) {
                            state.userDevice = {
                                ...initialState.userDevice,
                                padAdaptive640_992: true
                            }
                        }
                    } else {
                        if (!state.userDevice.padAdaptive) {
                            state.userDevice = {
                                ...initialState.userDevice,
                                padAdaptive: true
                            }
                        }
                    }
                } else if (action.payload.width >= 1280) {
                    if (!state.userDevice.desktopAdaptive) {
                        state.userDevice = {
                            ...initialState.userDevice,
                            desktopAdaptive: true
                        }
                    }
                }
            }
        ),
        setOpenedPhotoBlock: create.reducer(
            (
                state,
                action: PayloadAction<boolean>
            ) => {
                state.blocksMoving.openedPhotoBlock = action.payload
            }
        ),
        setOpenedVideoBlock: create.reducer(
            (
                state,
                action: PayloadAction<boolean>
            ) => {
                state.blocksMoving.openedVideoBlock = action.payload
            }
        ),
        setSwitchedMessageBlock: create.reducer(
            (
                state,
                action: PayloadAction<boolean>
            ) => {
                state.blocksMoving.switchedMessageBlock = action.payload
            }
        ),
        setDisableFormInputs: create.reducer((state) => {
            state.disableFormInputs = !state.disableFormInputs
        }),

        setCsrfToken: create.reducer((state, action: PayloadAction<CsrfTokenType>) => {
            state.csrfToken = action.payload.csrfToken
        }),

        setNewNotification: create.reducer(
            (state, action: PayloadAction<SetNotificationType>) => {
                const existingNotification = state.notificationList.findIndex((notice) => notice.message === action.payload.message)

                if (existingNotification !== -1) {
                    state.notificationList[existingNotification] = {
                        ...state.notificationList[existingNotification],
                        timeout: state.notificationList[existingNotification].timeout + 10000
                    }
                } else {
                    state.notificationList.push({
                        id: uuidv4(),
                        message: action.payload.message,
                        timeout: action.payload.timeout || 7000,
                        type: action.payload.type
                    })
                }
            }
        ),
        deleteNotification: create.reducer(
            (state, action: PayloadAction<DeleteNotificationType>) => {
                state.notificationList = state.notificationList.filter((notice) => notice.id !== action.payload.id)
            }
        ),

        setCookiePermission: create.reducer(
            (state, action: PayloadAction<boolean>) => {
                state.cookiePermission = action.payload
            }
        )
    }),
    selectors: {
        selectUserDevice: (state) => state.userDevice,
        selectBlocksMoving: (state) => state.blocksMoving,
        selectNotificationList: (state) => state.notificationList,
        selectDisableFormInputs: (state) => state.disableFormInputs,
        selectCsrfToken: (state) => state.csrfToken,
        selectCookiePermission: (state) => state.cookiePermission
    }
})

export const {
    setUserDevice,
    setOpenedPhotoBlock,
    setOpenedVideoBlock,
    setSwitchedMessageBlock,
    setNewNotification,
    deleteNotification,
    setDisableFormInputs,
    setCsrfToken,
    setCookiePermission,
} = appSlice.actions

export const {
    selectUserDevice,
    selectBlocksMoving,
    selectNotificationList,
    selectDisableFormInputs,
    selectCsrfToken,
    selectCookiePermission,
} = appSlice.selectors

import {createAppSlice} from "@/app/(auxiliary)/libs/redux-toolkit/store/createAppSlice";
import {RootPageContentType} from "@/app/(auxiliary)/types/Data/Interface/RootPage/RootPageContentType";
import {PayloadAction} from "@reduxjs/toolkit";
import {BlocksMovingType, UserDeviceStateType} from "@/app/(auxiliary)/types/AppTypes/Context";
import { DeleteNotificationType, NotificationListType, SetNotificationType } from "@/app/(auxiliary)/types/AppTypes/Notification";

interface InitialStateType {
    userDevice: UserDeviceStateType;
    blocksMoving: BlocksMovingType;
    // editorState: EditorStateType;
    rootPageContent: RootPageContentType;
    // microphoneStatus: P
    notificationList: NotificationListType;
    disableFormInputs: boolean
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
    // editorState: {
    //     currentFileIndex: 0,
    //     currentFileName: ""
    // },
    rootPageContent: {} as RootPageContentType,
    notificationList: [],
    disableFormInputs: false
    // microphoneStatus:
}

export const appSlice = createAppSlice({
    name: "app",
    initialState,
    reducers: (create) => ({
        setRootPageContent: create.reducer(
            (
                state,
                action: PayloadAction<RootPageContentType>
            ) => {
                state.rootPageContent = action.payload
            }
        ),
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

        setNewNotification: create.reducer(
            (state, action: PayloadAction<SetNotificationType>) => {
                const existingNotification = state.notificationList.findIndex((notice) => notice.message === action.payload.message)
                
                if(existingNotification !== -1) {
                    state.notificationList[existingNotification] = {
                        ...state.notificationList[existingNotification],
                        timeout: state.notificationList[existingNotification].timeout + 10000
                    }
                } else {
                    state.notificationList.push({
                        id: crypto.randomUUID(),
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
        )
    }),
    selectors: {
        selectRootPageContent: (state) => state.rootPageContent,
        selectUserDevice: (state) => state.userDevice,
        selectBlocksMoving: (state) => state.blocksMoving,
        selectNotificationList: (state) => state.notificationList,
        selectDisableFormInputs: (state) => state.disableFormInputs
    }
})

export const {
    setRootPageContent,
    setUserDevice,
    setOpenedPhotoBlock,
    setOpenedVideoBlock,
    setSwitchedMessageBlock,
    setNewNotification,
    deleteNotification,
    setDisableFormInputs
} = appSlice.actions

export const {
    selectRootPageContent,
    selectUserDevice,
    selectBlocksMoving,
    selectNotificationList,
    selectDisableFormInputs
} = appSlice.selectors

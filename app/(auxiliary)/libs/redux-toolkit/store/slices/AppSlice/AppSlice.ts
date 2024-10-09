import {createAppSlice} from "@/app/(auxiliary)/libs/redux-toolkit/store/createAppSlice";
import {RootPageContentType} from "@/app/(auxiliary)/types/Data/Interface/RootPage/RootPageContentType";
import {PayloadAction} from "@reduxjs/toolkit";
import {BlocksMovingType, UserDeviceStateType} from "@/app/(auxiliary)/types/AppTypes/Context";

interface InitialStateType {
    userDevice: UserDeviceStateType;
    blocksMoving: BlocksMovingType;
    // editorState: EditorStateType;
    rootPageContent: RootPageContentType;
    // microphoneStatus: P
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
        )
    }),
    selectors: {
        selectRootPageContent: (sel) => sel.rootPageContent,
        selectUserDevice: (sel) => sel.userDevice,
        selectBlocksMoving: (sel) => sel.blocksMoving,
    }
})

export const {
    setRootPageContent,
    setUserDevice,
    setOpenedPhotoBlock,
    setOpenedVideoBlock,
    setSwitchedMessageBlock
} = appSlice.actions

export const {
    selectRootPageContent,
    selectUserDevice,
    selectBlocksMoving,
} = appSlice.selectors

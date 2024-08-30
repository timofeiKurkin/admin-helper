import {createAppSlice} from "@/app/(auxiliary)/libs/redux-toolkit/store/createAppSlice";
import {
    COMPANY_KEY,
    DEVICE_KEY,
    MESSAGE_KEY,
    NAME_KEY,
    NUMBER_PC_KEY,
    PHONE_KEY,
    PHOTO_KEY,
    PhotoAndVideoKeysTypes,
    TextInputsKeysTypes,
    VIDEO_KEY
} from "@/app/(auxiliary)/types/AppTypes/InputHooksTypes";
import {
    CustomFileType,
    FormDataItemType,
    PermissionsOfFormStatesType,
    UserFormDataType
} from "@/app/(auxiliary)/types/AppTypes/Context";
import {PayloadAction} from "@reduxjs/toolkit";

interface InitialStateType extends UserFormDataType {
    permissions: PermissionsOfFormStatesType;
    validationFormStatus: boolean;
}

const initialState: InitialStateType = {
    file_data: {
        // [MESSAGE_KEY]: {} as File,
        [PHOTO_KEY]: {
            type: PHOTO_KEY,
            files: []
        },
        [VIDEO_KEY]: {
            type: VIDEO_KEY,
            files: []
        }
    },
    text_data: {
        [DEVICE_KEY]: {
            validationStatus: false,
            value: ""
        },
        [NAME_KEY]: {
            validationStatus: false,
            value: ""
        },
        [MESSAGE_KEY]: {
            validationStatus: false,
            value: ""
        },
        [COMPANY_KEY]: {
            validationStatus: false,
            value: ""
        },
        [NUMBER_PC_KEY]: {
            validationStatus: false,
            value: ""
        },
        [PHONE_KEY]: {
            validationStatus: false,
            value: ""
        }
    },
    permissions: {
        userCanTalk: false,
        userAgreed: false,
    },
    validationFormStatus: false
}

interface DataActionType<K, T> {
    key: K,
    data: T
}

interface DeleteFileAction {
    name: string;
}

export const userFormDataSlice = createAppSlice({
    name: "userFormDataSlice",
    initialState,
    reducers: (create) => ({
        changeTextData: create.reducer(
            (
                state,
                action: PayloadAction<DataActionType<TextInputsKeysTypes, FormDataItemType<string>>>
            ) => {
                state.text_data[action.payload.key] = action.payload.data
            }
        ),
        addFileData: create.reducer(
            (
                state,
                action: PayloadAction<DataActionType<PhotoAndVideoKeysTypes, FormDataItemType<CustomFileType[]>>>
            ) => {
                state.file_data[action.payload.key].files = [
                    ...state.file_data[action.payload.key].files,
                    ...action.payload.data.value
                ]
            }
        ),
        deleteFileData: create.reducer(
            (
                state,
                action: PayloadAction<DataActionType<PhotoAndVideoKeysTypes, DeleteFileAction>>
            ) => {
                state.file_data[action.payload.key].files =
                    state.file_data[action.payload.key].files.filter(
                        (file) => file.name !== action.payload.data.name
                    )
            }
        ),
        setPermissionPolitic: create.reducer(
            (state) => {
                state.permissions.userAgreed = !state.permissions.userAgreed
            }
        ),
        setUserCanTalk: create.reducer(
            (state) => {
                state.permissions.userCanTalk = !state.permissions.userCanTalk
            }
        ),
        setValidationFormStatus: create.reducer(
            (state) => {
                const textDataKeys = Object.keys(state.text_data)
                state.validationFormStatus = (textDataKeys as (TextInputsKeysTypes)[]).every((key) => (
                    state.text_data[key]?.validationStatus
                ))
            }
        )
    }),
    selectors: {
        selectFormTextData: (sel) => sel.text_data,
        selectFormFileData: (sel) => sel.file_data,
        selectPermissionsOfForm: (sel) => sel.permissions,
        selectValidationFormStatus: (sel) => sel.validationFormStatus
    }
})

export const {
    changeTextData,
    addFileData,
    deleteFileData,
    setPermissionPolitic,
    setUserCanTalk,
    setValidationFormStatus
} = userFormDataSlice.actions

export const {
    selectFormTextData,
    selectFormFileData,
    selectPermissionsOfForm,
    selectValidationFormStatus
} = userFormDataSlice.selectors

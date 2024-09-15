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
    FileLinkPreviewType,
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
            files: [],
            filesLinksPreview: []
        },
        [VIDEO_KEY]: {
            type: VIDEO_KEY,
            files: [],
            filesLinksPreview: []

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

/**
 * Работа с данными формы:
 * - changeTextData
 * - addFileData
 * - deleteFileData
 * - changePhotosPreview
 * 
 * Разрешения формы:
 * - setPermissionPolitic
 * - setUserCanTalk
 * 
 * Валидация формы
 * - setValidationFormStatus
 */
export const userFormDataSlice = createAppSlice({
    name: "userFormDataSlice",
    initialState,
    reducers: (create) => ({
        /**
         * Slice для изменения только текстовых данных в состоянии
         */
        changeTextData: create.reducer(
            (
                state,
                action: PayloadAction<DataActionType<TextInputsKeysTypes, FormDataItemType<string>>>
            ) => {
                state.text_data[action.payload.key] = action.payload.data
            }
        ),
        /**
         * Slice для добавления файлов в состояние. Добавить можно фото или видео
         */
        addFileData: create.reducer(
            (
                state,
                action: PayloadAction<DataActionType<PhotoAndVideoKeysTypes, FormDataItemType<File[]>>> // CustomFileType[]
            ) => {
                state.file_data[action.payload.key].filesLinksPreview = action.payload.data.value.map((file) => ({
                    name: file.name,
                    link: URL.createObjectURL(file)
                }))

                state.file_data[action.payload.key].files = [
                    ...state.file_data[action.payload.key].files,
                    ...action.payload.data.value
                ]
            }
        ),
        /**
         * Удаление файлов из состояния
         */
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
        /**
         * Обновление preview у каждого фото после применения настроек в фоторедакторе
         */
        changePhotosPreview: create.reducer((
            state,
            action: PayloadAction<FileLinkPreviewType[]>
        ) => {
            state.file_data["photo"].filesLinksPreview = action.payload
        }),
        
        /**
         * 
         */
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
        
        /**
         * Slice для изменения состояния всей валидации формы. Этот статус показывает, что все поля формы корректно заполнены, поэтому файлы могут быть отправлены на сервер
         */
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
    setValidationFormStatus,
    changePhotosPreview,
} = userFormDataSlice.actions

export const {
    selectFormTextData,
    selectFormFileData,
    selectPermissionsOfForm,
    selectValidationFormStatus
} = userFormDataSlice.selectors

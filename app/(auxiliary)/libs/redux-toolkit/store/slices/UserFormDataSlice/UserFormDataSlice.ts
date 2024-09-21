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
    FileListStateType,
    FormDataItemType,
    PermissionsOfFormStatesType,
    UserFormDataType
} from "@/app/(auxiliary)/types/AppTypes/Context";
import {PayloadAction} from "@reduxjs/toolkit";
import {FileListType} from "@/app/(auxiliary)/types/DropZoneTypes/DropZoneTypes";
import {indexOfObject} from "@/app/(auxiliary)/func/handlers";

interface InitialStateType extends UserFormDataType {
    permissions: PermissionsOfFormStatesType;
    validationFormStatus: boolean;
}

const initialState: InitialStateType = {
    file_data: {
        // [MESSAGE_KEY]: {} as File,
        [PHOTO_KEY]: {
            type: PHOTO_KEY,
            filesNames: [],
            files: [],
            filesFinally: []
        },
        [VIDEO_KEY]: {
            type: VIDEO_KEY,
            filesNames: [],
            files: [],
            filesFinally: []
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

type ChangePreviewActionType = DataActionType<PhotoAndVideoKeysTypes, File | File[]>

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
                state.file_data[action.payload.key].files =
                    state.file_data[action.payload.key].files.concat(action.payload.data.value)

                state.file_data[action.payload.key].filesNames = state.file_data[action.payload.key].filesNames.concat(action.payload.data.value.map((f) => f.name))
            }
        ),
        /**
         * Удаление файлов из состояния
         */
        deleteFile: create.reducer(
            (
                state,
                action: PayloadAction<DataActionType<PhotoAndVideoKeysTypes, DeleteFileAction>>
            ) => {
                const filter = <T extends File | string>(item: T) => {
                    if (item instanceof File) {
                        return item.name !== action.payload.data.name
                    } else if (typeof item === "string") {
                        return item !== action.payload.data.name
                    }
                }

                state.file_data[action.payload.key] = {
                    type: action.payload.key,

                    /**
                     * Удаление исходного файла
                     */
                    files: state.file_data[action.payload.key].files.filter(filter),

                    /**
                     * Удаление файла, подвергшийся изменениям пользователя в фоторедакторе
                     */
                    filesFinally: state.file_data[action.payload.key].filesFinally.filter(filter),

                    /**
                     * Удаление имени из списка доступных файлов к открытию
                     */
                    filesNames: state.file_data[action.payload.key].filesNames.filter(filter)
                }
            }
        ),

        /**
         * Обновление и создание preview для каждого файла: фото и видео.
         * Также обновление превью у каждого фото после применения настроек в фоторедакторе
         */
        changePreview: create.reducer((
            state,
            action: PayloadAction<ChangePreviewActionType>
        ) => {
            const changePreview = (newFile: File, key: PhotoAndVideoKeysTypes) => {
                const previewIndex = indexOfObject(state.file_data[key].filesFinally, newFile)

                if (previewIndex !== -1) {
                    state.file_data[key].filesFinally[previewIndex] = newFile
                } else {
                    state.file_data[key].filesFinally.push(newFile)
                }
            }

            if (Array.isArray(action.payload.data)) {
                action.payload.data.forEach((file) => {
                    changePreview(file, action.payload.key)
                })
            } else if (action.payload.data instanceof File) {
                changePreview(action.payload.data, action.payload.key)
            }
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
        selectFormTextData: (state) => state.text_data,
        selectFormFileData: (state) => state.file_data,
        selectPermissionsOfForm: (state) => state.permissions,
        selectValidationFormStatus: (state) => state.validationFormStatus
    }
})

export const {
    changeTextData,
    addFileData,
    deleteFile,
    setPermissionPolitic,
    setUserCanTalk,
    setValidationFormStatus,

    // addVideoPreview,
    // changePhotosPreview,
    changePreview
} = userFormDataSlice.actions

export const {
    selectFormTextData,
    selectFormFileData,
    selectPermissionsOfForm,
    selectValidationFormStatus
} = userFormDataSlice.selectors

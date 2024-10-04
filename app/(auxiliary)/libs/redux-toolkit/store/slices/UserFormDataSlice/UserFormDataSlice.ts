import {createAppSlice} from "@/app/(auxiliary)/libs/redux-toolkit/store/createAppSlice";
import {
    AllKeysTypesOfInputs,
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
    FormDataItemType,
    PermissionsOfFormStatesType,
    ServerResponseType,
    UserFormDataType
} from "@/app/(auxiliary)/types/AppTypes/Context";
import {PayloadAction} from "@reduxjs/toolkit";
import {indexOfObject} from "@/app/(auxiliary)/func/handlers";

interface InitialStateType extends UserFormDataType {
    permissions: PermissionsOfFormStatesType;
    validationFormStatus: boolean;
    userMessageStatus: boolean;
    serverResponse: ServerResponseType;
    // resetForm:
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
        },
        [MESSAGE_KEY]: {
            validationStatus: false,
            // type: MESSAGE_KEY,
            value: {} as File
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
    validationFormStatus: false,
    userMessageStatus: false,
    serverResponse: {
        status: "",
        sentToServer: false,
        message: ""
    },
    // resetForm: false
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

        addMessageData: create.reducer((
            state,
            action: PayloadAction<FormDataItemType<string | File>>
        ) => {
            const payload = action.payload

            if (typeof payload.value === "string") {
                state.text_data[MESSAGE_KEY] = {
                    value: payload.value,
                    validationStatus: payload.validationStatus
                }
            } else {
                state.file_data[MESSAGE_KEY] = {
                    value: payload.value,
                    validationStatus: payload.validationStatus
                }
            }
        }),

        deleteMessageRecorder: create.reducer((
            state
        ) => {
            state.file_data[MESSAGE_KEY] = {
                value: {} as File,
                validationStatus: false
            }
        }),

        /**
         * Slice для добавления файлов в состояние. Добавить можно фото или видео
         */
        addFileData: create.reducer(
            (
                state,
                action: PayloadAction<DataActionType<PhotoAndVideoKeysTypes, FormDataItemType<File[]>>> // CustomFileType[]
            ) => {
                const key = action.payload.key
                const newFile = action.payload.data.value

                state.file_data[key].files = state.file_data[key].files.concat(newFile)
                state.file_data[key].filesNames =
                    state.file_data[key].filesNames.concat(newFile.map((f) => f.name))
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
                const key = action.payload.key

                const filter = <T extends File | string>(item: T) => {
                    if (item instanceof File) {
                        return item.name !== action.payload.data.name
                    } else if (typeof item === "string") {
                        return item !== action.payload.data.name
                    }
                }

                state.file_data[key] = {
                    type: key,

                    /**
                     * Удаление исходного файла
                     */
                    files: state.file_data[key].files.filter(filter),

                    /**
                     * Удаление файла, подвергшийся изменениям пользователя в фоторедакторе
                     */
                    filesFinally: state.file_data[key].filesFinally.filter(filter),

                    /**
                     * Удаление имени из списка доступных файлов к открытию
                     */
                    filesNames: state.file_data[key].filesNames.filter(filter)
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
            const key = action.payload.key

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
                    changePreview(file, key)
                })
            } else if (action.payload.data instanceof File) {
                changePreview(action.payload.data, key)
            }
        }),
        switchUserMessageStatus: create.reducer(
            (state) => {
                state.userMessageStatus = !state.userMessageStatus
            }
        ),

        /**
         *
         */
        setAgreePolitics: create.reducer(
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
                state.validationFormStatus = (textDataKeys as (TextInputsKeysTypes)[]).every((key) => {
                    if (key === "message") {
                        return state.text_data[key].validationStatus || state.file_data[key].validationStatus
                    } else {
                        return state.text_data[key]?.validationStatus
                    }
                })
            }
        ),

        setServerResponse: create.reducer(
            (state, action: PayloadAction<ServerResponseType>) => {
                state.serverResponse = action.payload
            }
        ),


        setFormToDefault: create.reducer(
            (state) => {
                state.file_data = initialState.file_data
                state.permissions = initialState.permissions
                state.text_data[DEVICE_KEY] = {
                    value: "",
                    validationStatus: false
                }

                if (!state.userMessageStatus) {
                    state.text_data[MESSAGE_KEY] = initialState.text_data[MESSAGE_KEY]
                }
            }
        ),
    }),
    selectors: {
        selectFormTextData: (state) => state.text_data,
        selectFormFileData: (state) => state.file_data,
        selectPermissionsOfForm: (state) => state.permissions,
        selectValidationFormStatus: (state) => state.validationFormStatus,
        selectUserMessageStatus: (state) => state.userMessageStatus,
        selectServerResponse: (state) => state.serverResponse
    }
})

export const {
    changeTextData,
    addFileData,
    deleteFile,
    setAgreePolitics,
    setUserCanTalk,
    setValidationFormStatus,
    addMessageData,
    deleteMessageRecorder,
    switchUserMessageStatus,

    changePreview,
    setServerResponse,
    setFormToDefault
} = userFormDataSlice.actions

export const {
    selectFormTextData,
    selectFormFileData,
    selectPermissionsOfForm,
    selectValidationFormStatus,
    selectUserMessageStatus,
    selectServerResponse
} = userFormDataSlice.selectors

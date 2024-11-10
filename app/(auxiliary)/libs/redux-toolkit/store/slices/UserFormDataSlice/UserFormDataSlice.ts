import { indexOfObject } from "@/app/(auxiliary)/func/handlers";
import { createAppSlice } from "@/app/(auxiliary)/libs/redux-toolkit/store/createAppSlice";
import {
    FormDataItemType,
    PermissionsOfFormType,
    ServerResponseType,
    UserFormDataType
} from "@/app/(auxiliary)/types/AppTypes/ContextTypes";
import {
    COMPANY_KEY,
    DEVICE_KEY,
    MESSAGE_KEY,
    MessageInputDataType,
    NAME_KEY,
    NUMBER_PC_KEY,
    PHONE_KEY,
    PHOTO_KEY,
    PhotoAndVideoKeysType,
    TextInputsKeysType,
    ValidateKeysType,
    VIDEO_KEY,
    CompanyInputDataType
} from "@/app/(auxiliary)/types/AppTypes/InputHooksTypes";
import { PayloadAction } from "@reduxjs/toolkit";

interface InitialStateType extends UserFormDataType {
    permissions: PermissionsOfFormType;
    messageInputDataType: MessageInputDataType;
    companyInputDataType: CompanyInputDataType;
    serverResponse: ServerResponseType;
    rejectionInputs: ValidateKeysType[];
}

const initialState: InitialStateType = {
    file_data: {
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
            value: "",
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
        userAgreedPolitical: false,
    },
    messageInputDataType: "file",
    companyInputDataType: "choose",
    serverResponse: {
        status: "",
        sentToServer: false,
        message: ""
    },
    rejectionInputs: []
}

interface DataActionType<K, T> {
    key: K,
    data: T
}

type ChangePreviewActionType = DataActionType<PhotoAndVideoKeysType, File | File[]>

interface DeleteFileAction {
    name: string;
}

/**
 * Working with form data:
 * - changeTextData
 * - addFileData
 * - deleteFileData
 * - changePhotosPreview
 *
 * Form Permissions:
 * - setPermissionPolitic
 * - setUserCanTalk
 *
 * Form validation
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
                action: PayloadAction<DataActionType<TextInputsKeysType, FormDataItemType<string>>>
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
                action: PayloadAction<DataActionType<PhotoAndVideoKeysType, FormDataItemType<File[]>>> // CustomFileType[]
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
                action: PayloadAction<DataActionType<PhotoAndVideoKeysType, DeleteFileAction>>
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

            const changePreview = (newFile: File, key: PhotoAndVideoKeysType) => {
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

        changeMessageInputDataType: create.reducer(
            (state, action: PayloadAction<MessageInputDataType>) => {
                state.messageInputDataType = action.payload
            }
        ),

        changeCompanyInputDataType: create.reducer((state, action: PayloadAction<CompanyInputDataType>) => {
            state.companyInputDataType = action.payload
        }),

        /**
         * User agreed with data political processing
         */
        setAgreePolitics: create.reducer(
            (state) => {
                state.permissions.userAgreedPolitical = !state.permissions.userAgreedPolitical
            }
        ),

        setUserCanTalk: create.reducer(
            (state) => {
                state.permissions.userCanTalk = !state.permissions.userCanTalk
            }
        ),

        setRejectionInputs: create.reducer(
            (state, action: PayloadAction<ValidateKeysType[]>) => {
                state.rejectionInputs = action.payload
            }
        ),

        deleteRejectionInput: create.reducer(
            (state, action: PayloadAction<ValidateKeysType>) => {
                state.rejectionInputs = state.rejectionInputs.filter((rejection) => rejection !== action.payload)
            }
        ),

        setServerResponse: create.reducer(
            (state, action: PayloadAction<ServerResponseType>) => {
                state.serverResponse = action.payload
            }
        ),


        resetFormToDefault: create.reducer(
            (state) => {
                state.file_data = initialState.file_data
                state.permissions = initialState.permissions
                state.text_data[DEVICE_KEY] = {
                    value: "",
                    validationStatus: false
                }

                if (state.messageInputDataType === "file") {
                    state.text_data[MESSAGE_KEY] = initialState.text_data[MESSAGE_KEY]
                }
            }
        ),
    }),
    selectors: {
        selectFormTextData: (state) => state.text_data,
        selectFormFileData: (state) => state.file_data,
        selectPermissionsOfForm: (state) => state.permissions,
        selectMessageInputDataType: (state) => state.messageInputDataType,
        selectCompanyInputDataType: (state) => state.companyInputDataType,
        selectServerResponse: (state) => state.serverResponse,
        selectRejectionInputs: (state) => state.rejectionInputs
    }
})

export const {
    changeTextData,
    addFileData,
    deleteFile,
    setAgreePolitics,
    setUserCanTalk,
    addMessageData,
    deleteMessageRecorder,
    changePreview,

    setRejectionInputs,
    deleteRejectionInput,

    changeMessageInputDataType,
    changeCompanyInputDataType,

    resetFormToDefault,

    setServerResponse,
} = userFormDataSlice.actions

export const {
    selectFormTextData,
    selectFormFileData,
    selectPermissionsOfForm,
    selectRejectionInputs,

    selectMessageInputDataType,
    selectCompanyInputDataType,

    selectServerResponse,
} = userFormDataSlice.selectors

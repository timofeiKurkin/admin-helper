import {createAppSlice} from "@/app/(auxiliary)/libs/redux-toolkit/store/createAppSlice";
import {PayloadAction} from "@reduxjs/toolkit";
import {WritableDraft} from "immer";
import {PhotoEditorSettingsType} from "@/app/(auxiliary)/types/PhotoEditorTypes/PhotoEditorTypes";


interface InitialState {
    currentFileName: string;
    photoListSettings: PhotoEditorSettingsType[];
    editorIsOpen: boolean;
}

const initialState: InitialState = {
    currentFileName: "",
    photoListSettings: [],
    editorIsOpen: false
}

export const photoEditorSlice = createAppSlice({
    name: "photo-editor",
    initialState,
    reducers: (create) => ({
        setCurrentOpenedFileName: create.reducer(
            (state, action: PayloadAction<{ fileName: string }>) => {
                state.currentFileName = action.payload.fileName
            }
        ),
        changePhotoSettings: create.reducer(
            (state, action: PayloadAction<PhotoEditorSettingsType>) => {
                const objectIs = state.photoListSettings.find(
                    (item) => item.name === action.payload.name
                )

                if (objectIs) {
                    state.photoListSettings.forEach(
                        (photoSetting, index) => {
                            if (photoSetting.name === action.payload.name) {
                                state.photoListSettings[index] = {...state.photoListSettings[index], ...action.payload as WritableDraft<PhotoEditorSettingsType>};
                            }
                        }
                    );
                } else {
                    state.photoListSettings.push(action.payload as WritableDraft<PhotoEditorSettingsType>)
                }
            }
        ),

        /**
         * Изменение состояния на открытие и закрытие фоторедактора
         */
        changeEditorVisibility: create.reducer(
            (state) => {
                state.editorIsOpen = !state.editorIsOpen
            }
        ),

        deletePhotoSettings: create.reducer(
            (state, action: PayloadAction<{name: string}>) => {
                state.photoListSettings = state.photoListSettings.filter((setting) => setting.name !== action.payload.name)
            }
        )
    }),
    selectors: {
        selectCurrentFileName: (state) => state.currentFileName,
        selectPhotoListSettings: (state) => state.photoListSettings,
        selectEditorIsOpen: (state) => state.editorIsOpen
    }
})

export const {
    setCurrentOpenedFileName,
    changePhotoSettings,
    changeEditorVisibility
} = photoEditorSlice.actions

export const {
    selectCurrentFileName,
    selectPhotoListSettings,
    selectEditorIsOpen
} = photoEditorSlice.selectors

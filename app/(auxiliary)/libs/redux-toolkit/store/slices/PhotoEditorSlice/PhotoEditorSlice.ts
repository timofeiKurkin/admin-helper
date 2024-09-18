import {createAppSlice} from "@/app/(auxiliary)/libs/redux-toolkit/store/createAppSlice";
import {PayloadAction} from "@reduxjs/toolkit";
import {WritableDraft} from "immer";
import {PhotoEditorSettingsType} from "@/app/(auxiliary)/types/PhotoEditorTypes/PhotoEditorTypes";


interface InitialState {
    openedFileName: string;
    photoListSettings: PhotoEditorSettingsType[];
    editorIsOpen: boolean;
}

const initialState: InitialState = {
    openedFileName: "",
    photoListSettings: [],
    editorIsOpen: false
}

export const photoEditorSlice = createAppSlice({
    name: "photo-editor",
    initialState,
    reducers: (create) => ({
        setCurrentOpenedFileName: create.reducer(
            (state, action: PayloadAction<{ fileName: string }>) => {
                state.openedFileName = action.payload.fileName
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
        selectOpenedFileName: (state) => state.openedFileName,
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
    selectOpenedFileName,
    selectPhotoListSettings,
    selectEditorIsOpen
} = photoEditorSlice.selectors

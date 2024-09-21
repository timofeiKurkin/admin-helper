import {createAppSlice} from "@/app/(auxiliary)/libs/redux-toolkit/store/createAppSlice";
import {PayloadAction} from "@reduxjs/toolkit";
import {WritableDraft} from "immer";
import {PhotoEditorSettingsType, VideoOrientationType} from "@/app/(auxiliary)/types/PopupTypes/PopupTypes";
import {indexOfObject} from "@/app/(auxiliary)/func/handlers";


interface InitialState {
    openedFileName: string;
    photoListSettings: PhotoEditorSettingsType[];
    videoOrientations: VideoOrientationType[];
    photoEditorIsOpen: boolean;
    videoPlayerIfOpen: boolean;
}

const initialState: InitialState = {
    openedFileName: "",
    photoListSettings: [],
    videoOrientations: [],
    photoEditorIsOpen: false,
    videoPlayerIfOpen: false
}

export const popupSlice = createAppSlice({
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
                const settingIndex = indexOfObject(state.photoListSettings, action.payload)

                if (settingIndex !== -1) {
                    state.photoListSettings[settingIndex] = {...state.photoListSettings[settingIndex], ...action.payload as WritableDraft<PhotoEditorSettingsType>}
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
                state.photoEditorIsOpen = !state.photoEditorIsOpen
            }
        ),

        deletePhotoSettings: create.reducer(
            (state, action: PayloadAction<{ name: string }>) => {
                state.photoListSettings = state.photoListSettings.filter((setting) => setting.name !== action.payload.name)
            }
        ),

        changeVideoOrientation: create.reducer(
            (state, action: PayloadAction<VideoOrientationType>) => {
                const orientationIndex = indexOfObject(state.videoOrientations, action.payload)

                if(orientationIndex !== -1) {
                    state.videoOrientations[orientationIndex] = action.payload
                } else {
                    state.videoOrientations.push(action.payload)
                }
            }
        )
    }),
    selectors: {
        selectOpenedFileName: (state) => state.openedFileName,
        selectPhotoListSettings: (state) => state.photoListSettings,
        selectEditorIsOpen: (state) => state.photoEditorIsOpen,
        selectVideoOrientations: (state) => state.videoOrientations
    }
})

export const {
    setCurrentOpenedFileName,
    changePhotoSettings,
    changeEditorVisibility,
    changeVideoOrientation
} = popupSlice.actions

export const {
    selectOpenedFileName,
    selectPhotoListSettings,
    selectEditorIsOpen,
    selectVideoOrientations
} = popupSlice.selectors

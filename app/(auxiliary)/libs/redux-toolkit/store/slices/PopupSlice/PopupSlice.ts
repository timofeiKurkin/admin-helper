import {createAppSlice} from "@/app/(auxiliary)/libs/redux-toolkit/store/createAppSlice";
import {PayloadAction} from "@reduxjs/toolkit";
import {WritableDraft} from "immer";
import {PhotoEditorSettingsType, VideoOrientationType} from "@/app/(auxiliary)/types/PopupTypes/PopupTypes";
import {indexOfObject} from "@/app/(auxiliary)/func/handlers";
import {PHOTO_KEY, VIDEO_KEY} from "@/app/(auxiliary)/types/AppTypes/InputHooksTypes";


interface InitialState {
    openedFileName: string;
    photoListSettings: PhotoEditorSettingsType[];
    videoOrientations: VideoOrientationType[];
    popups: {
        [PHOTO_KEY]: boolean
        [VIDEO_KEY]: boolean
        // photoEditorIsOpen: boolean;
        // videoPlayerIsOpen: boolean;
    }
}

const initialState: InitialState = {
    openedFileName: "",
    photoListSettings: [],
    videoOrientations: [],
    popups: {
        [PHOTO_KEY]: false,
        [VIDEO_KEY]: false
    }
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
        changePhotoEditorVisibility: create.reducer(
            (state) => {
                state.popups[PHOTO_KEY] = !state.popups[PHOTO_KEY]
            }
        ),

        changeVideoPlayerVisibility: create.reducer(
            (state) => {
                state.popups[VIDEO_KEY] = !state.popups[VIDEO_KEY]
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

                if (orientationIndex !== -1) {
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
        selectVideoOrientations: (state) => state.videoOrientations,
        selectPopups: (state) => state.popups,
    }
})

export const {
    setCurrentOpenedFileName,
    changePhotoSettings,
    changePhotoEditorVisibility,
    changeVideoPlayerVisibility,
    changeVideoOrientation
} = popupSlice.actions

export const {
    selectOpenedFileName,
    selectPhotoListSettings,
    selectVideoOrientations,
    selectPopups
} = popupSlice.selectors

import {createAppSlice} from "@/app/(auxiliary)/libs/redux-toolkit/store/createAppSlice";
import {PayloadAction} from "@reduxjs/toolkit";
import {WritableDraft} from "immer";
import {PhotoEditorSettingsType, VideoOrientationType} from "@/app/(auxiliary)/types/PopupTypes/PopupTypes";
import {indexOfObject} from "@/app/(auxiliary)/func/handlers";
import {PHOTO_KEY, PhotoAndVideoKeysType, VIDEO_KEY} from "@/app/(auxiliary)/types/AppTypes/InputHooksTypes";


interface InitialState {
    openedFileName: string;
    photoListSettings: PhotoEditorSettingsType[];
    videoOrientations: VideoOrientationType[];
    openedPopup: {
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
    openedPopup: {
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
            (
                state,
                action: PayloadAction<PhotoEditorSettingsType | PhotoEditorSettingsType[]>
            ) => {
                const changePhotoSettings = (setting: PhotoEditorSettingsType) => {
                    const settingIndex = indexOfObject(state.photoListSettings, setting)

                    if (settingIndex !== -1) {
                        state.photoListSettings[settingIndex] =
                            {...state.photoListSettings[settingIndex], ...setting}
                    } else {
                        state.photoListSettings.push(setting)
                    }
                }

                if (Array.isArray(action.payload)) {
                    action.payload.forEach((setting) => changePhotoSettings(setting))
                } else {
                    changePhotoSettings(action.payload)
                }
            }
        ),

        /**
         * Изменение состояния открытия и закрытия фоторедактора или видео плеера, в зависимости от переданного типа
         */
        changePopupVisibility: create.reducer(
            (state, action: PayloadAction<{ type: PhotoAndVideoKeysType }>) => {
                state.openedPopup[action.payload.type] = !state.openedPopup[action.payload.type]
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
        selectPopups: (state) => state.openedPopup,
    }
})

export const {
    setCurrentOpenedFileName,
    changePhotoSettings,

    changePopupVisibility,

    changeVideoOrientation,

    deletePhotoSettings
} = popupSlice.actions

export const {
    selectOpenedFileName,
    selectPhotoListSettings,
    selectVideoOrientations,
    selectPopups
} = popupSlice.selectors

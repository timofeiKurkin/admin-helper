import {createAppSlice} from "@/app/(auxiliary)/libs/redux-toolkit/store/createAppSlice";
import {PayloadAction} from "@reduxjs/toolkit";
import {WritableDraft} from "immer";
import {PhotoEditorSettingsType} from "@/app/(auxiliary)/types/PhotoEditorTypes/PhotoEditorTypes";


interface InitialState {
    currentFileIndex: number;
    currentFileName: string;
    photoListSettings: PhotoEditorSettingsType[];
}

const initialState: InitialState = {
    currentFileIndex: 0,
    currentFileName: "",
    photoListSettings: []
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
        )
    }),
    selectors: {
        selectCurrentFileIndex: (state) => state.currentFileIndex,
        selectCurrentFileName: (state) => state.currentFileName,
        selectPhotoListSettings: (state) => state.photoListSettings
    }
})

export const {
    setCurrentOpenedFileName,
    changePhotoSettings
} = photoEditorSlice.actions

export const {
    selectCurrentFileIndex,
    selectCurrentFileName,
    selectPhotoListSettings
} = photoEditorSlice.selectors

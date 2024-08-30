import React, {MutableRefObject, RefObject} from "react";
import {createAppSlice} from "@/app/(auxiliary)/libs/redux-toolkit/store/createAppSlice";
import {Crop, PixelCrop} from "react-image-crop";
import {PayloadAction} from "@reduxjs/toolkit";
import {produce, WritableDraft} from "immer";

interface PhotoEditorSetting {
    // The setting states of picture
    fileName: string;
    // canvas: {};
    scale: number;
    rotate: number;
    crop: Crop;
    aspect: number;

    // States for save picture
    previewCanvasRef: React.RefObject<HTMLCanvasElement>; // there's in state
    imgRef: React.RefObject<HTMLImageElement>; // there's in state
    completedCrop: PixelCrop; // there's in state
    // blobUrlRef: MutableRefObject<string>; // there's in state
    hiddenAnchorRef: RefObject<HTMLAnchorElement>; // there's in state
}

interface InitialState {
    currentFileIndex: number;
    currentFileName: string;
    photoListSettings: PhotoEditorSetting[];
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
            (state, action: PayloadAction<PhotoEditorSetting>) => {
                if (state.photoListSettings.length) {
                    const objectIs = state.photoListSettings.find((item) => item.fileName === action.payload.fileName)
                    if (objectIs) {
                        // state.photoListSettings = produce(state.photoListSettings, (draft) => {
                        //     return draft.map((photoSetting) => {
                        //         if (photoSetting.fileName === action.payload.fileName) {
                        //             return action.payload as WritableDraft<PhotoEditorSetting>; // Здесь можно безопасно заменить объект
                        //         }
                        //         return photoSetting;
                        //     });
                        // });

                        state.photoListSettings.forEach((photoSetting, index) => {
                            if (photoSetting.fileName === action.payload.fileName) {
                                state.photoListSettings[index] = {...state.photoListSettings[index], ...action.payload as WritableDraft<PhotoEditorSetting>};
                            }
                        });
                    } else {
                        state.photoListSettings = [action.payload as WritableDraft<PhotoEditorSetting>]
                    }
                } else {
                    state.photoListSettings = [action.payload as WritableDraft<PhotoEditorSetting>]
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

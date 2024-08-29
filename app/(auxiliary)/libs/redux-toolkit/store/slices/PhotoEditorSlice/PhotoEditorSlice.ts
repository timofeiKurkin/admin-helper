import React from "react";
import {createAppSlice} from "@/app/(auxiliary)/libs/redux-toolkit/store/createAppSlice";
import {Crop, PixelCrop} from "react-image-crop";
import {PayloadAction} from "@reduxjs/toolkit";

interface PhotoEditorSetting {
    fileName: string;
    canvas: {};
    scale: number;
    rotate: number;
    crop: Crop;
    aspect: number;
    imgRef: React.RefObject<HTMLImageElement>;
    completedCrop: PixelCrop;
}

interface InitialState {
    currentFileIndex: number;
    currentFileName: string;
    photoEditorSettings: PhotoEditorSetting[]
}

const initialState: InitialState = {
    currentFileIndex: 0,
    currentFileName: "",
    photoEditorSettings: []
}

export const photoEditorSlice = createAppSlice({
    name: "photo-editor",
    initialState,
    reducers: (create) => ({
        setCurrentOpenedFileName: create.reducer(
            (state, action: PayloadAction<{fileName: string}>) => {
                state.currentFileName = action.payload.fileName
            }
        )
    }),
    selectors: {
        selectCurrentFileIndex: (state) => state.currentFileIndex,
        selectCurrentFileName: (state) => state.currentFileName,
        selectPhotoEditorSettings: (state) => state.photoEditorSettings
    }
})

export const {
    setCurrentOpenedFileName
} = photoEditorSlice.actions

export const {
    selectCurrentFileIndex,
    selectCurrentFileName,
    selectPhotoEditorSettings
} = photoEditorSlice.selectors

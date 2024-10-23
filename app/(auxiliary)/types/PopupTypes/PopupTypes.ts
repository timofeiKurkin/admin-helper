import {Crop} from "react-image-crop";

export type ImageOrientationType = "vertical" | "horizontal";
export type RangeTickType = "scale" | "rotate";
export type PhotoSettingKeysType = "scale" | "rotate" | "crop" | "name"

export interface VideoOrientationType {
    name: string;
    orientation: "horizontal" | "vertical";
}

export interface PossibleCroppingBoundaryType {
    name: string;
    x: number;
    y: number;
    width: number;
    height: number;
    orientation: ImageOrientationType;
}

export interface PhotoEditorSettingsType {
    // The setting states of picture
    name: string; // File name for finding settings
    scale: number;
    rotate: number;
    crop: Crop;
}

export interface ControlsPropsType {
    data: string;
    value: number;
    updateFunc: (value: number) => void;
}

export interface RangeTicksProps {
    value: number;
    max?: number;
    min?: number;
    type: RangeTickType;
    unit: "%" | "x"
    pickTick: (value: number) => void
}

export type CustomFile = File & { id: number; }

export const defaultCropSettings: Crop = {
    unit: "%",
    x: 0,
    y: 0,
    width: 100,
    height: 100
}

export const defaultPhotoSettings: PhotoEditorSettingsType = {
    name: "",
    scale: 1,
    rotate: 0,
    crop: defaultCropSettings
}


export const HORIZONTAL = "horizontal";
export const VERTICAL = "vertical"

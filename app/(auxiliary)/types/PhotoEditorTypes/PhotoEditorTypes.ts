export type ImageOrientationType = "vertical" | "horizontal";

export interface PossibleCroppingBoundaryType {
    x: number;
    y: number;
    width: number;
    height: number;
    orientation: ImageOrientationType;
}

export const HORIZONTAL = "horizontal";
export const VERTICAL = "vertical"

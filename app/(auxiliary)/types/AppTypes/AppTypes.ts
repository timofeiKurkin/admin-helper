import React, { ChangeEvent } from "react";

export type ChangeEventHandlerType<T> = ChangeEvent<T>
export type InputChangeEventHandler = ChangeEventHandlerType<HTMLInputElement>
export type TextareaChangeEventHandler = ChangeEventHandlerType<HTMLTextAreaElement>

export type MouseEventHandler<T> = React.MouseEvent<T, MouseEvent>
export type DivMouseEventHandler = MouseEventHandler<HTMLDivElement>

export type KeyBoardEventHandler<T> = React.KeyboardEvent<T>
export type ChildrenProp = { children: React.ReactNode };

export interface ButtonImageProps {
    position?: "right" | "left";
    visibleOnlyImage: boolean;
    children: React.ReactNode;
}
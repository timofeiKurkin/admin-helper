import React, {ChangeEvent} from "react";

export type ChangeEventHandlerType<T> = ChangeEvent<T>
export type InputChangeEventHandler = ChangeEventHandlerType<HTMLInputElement>
export type TextareaChangeEventHandler = ChangeEventHandlerType<HTMLTextAreaElement>

export type KeyBoardEventHandler<T> = React.KeyboardEvent<T>
export type ChildrenType = {children: React.ReactNode};
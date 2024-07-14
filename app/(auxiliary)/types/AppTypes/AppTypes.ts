import React, {ChangeEvent} from "react";

export type ChangeEventHandler<T> = ChangeEvent<T>
export type InputChangeEventHandler = ChangeEventHandler<HTMLInputElement>
export type TextareaChangeEventHandler = ChangeEventHandler<HTMLTextAreaElement>

export type KeyBoardEventHandler<T> = React.KeyboardEvent<T>
export type ChildrenType = {children: React.ReactNode};
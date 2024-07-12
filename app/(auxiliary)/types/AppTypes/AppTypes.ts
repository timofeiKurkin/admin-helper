import React, {ChangeEvent} from "react";

export type InputChangeEventHandler = ChangeEvent<(HTMLInputElement | HTMLTextAreaElement)>
export type ChildrenType = {children: React.ReactNode};
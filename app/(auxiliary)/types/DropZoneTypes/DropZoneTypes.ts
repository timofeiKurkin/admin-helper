import {DropzoneInputProps, DropzoneRootProps} from "react-dropzone";

export type FileListType = File[];
export type GetRootPropsType = <T extends DropzoneRootProps>(props?: T) => T;
export type GetInputPropsType = <T extends DropzoneInputProps>(props?: T) => T;
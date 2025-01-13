export interface PhotoEditorDataType {
    title: string;
    editor: EditorDataType;
    photoList: PhotoListDataType;
    buttons: EditorsButtonsDataType;
}

export interface VideoPlayerDataType {
    title: string;
    photoList: { uploadedPhotos: string; }
    buttons: { close: string; }
}

export interface EditorDataType {
    scale: string;
    rotate: string;
    resetSettings: string;
    delete: string;
}

export interface PhotoListDataType {
    uploadedPhotos: string;
}

interface EditorsButtonsDataType {
    save: string;
    close: string;
}

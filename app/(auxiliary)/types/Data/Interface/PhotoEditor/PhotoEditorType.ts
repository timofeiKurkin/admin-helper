export interface PhotoEditorType {
    title: string;
    editor: EditorType;
    photoList: PhotoListType;
    buttons: ButtonsType;
}

export interface EditorType {
    scale: string;
    rotate: string;
    resetSettings: string;
    delete: string;
}

export interface PhotoListType {
    uploadedPhotos: string;
}

interface ButtonsType {
    save: string;
    close: string;
}

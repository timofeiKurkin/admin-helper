export interface PhotoEditorDataType {
    title: string;
    editor: EditorDataType;
    photoList: PhotoListDataType;
    buttons: EditorsButtonsDataType;
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

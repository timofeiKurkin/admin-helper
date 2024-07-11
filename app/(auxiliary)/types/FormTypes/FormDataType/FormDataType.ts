export interface FormDataType {
    userProblem: {
        device: string;
        message: DataMessageType;
        photo: DataPhotoType;
        video: DataVideoType;
    }
    aboutUser: {
        name: string;
        phone: string;
        company: string;
        pcNumber: string;
    }
}

export interface DataMessageType {
    message: string | File;
}

export interface DataPhotoType {
    photo: File;
}

export interface DataVideoType {
    video: File;
}
export type NotificationListType = NotificationType[]

export interface SetNotificationType {
    message: string;
}

export interface DeleteNotificationType {
    id: string;
}

export interface NotificationType extends SetNotificationType, DeleteNotificationType {
    timeout: number
}
export type NotificationListType = NotificationType[]

export interface SetNotificationType {
    type: "success" | "error" | "warning";
    message: string;
    timeout?: number;
}

export interface DeleteNotificationType {
    id: string;
}

export interface NotificationType extends SetNotificationType, DeleteNotificationType {
    timeout: number;
}
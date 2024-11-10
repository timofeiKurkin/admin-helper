import React, { FC } from 'react'
import Text from '../../../UI/TextTemplates/Text';
import styles from "../NotificationBlock.module.scss";
import { NotificationType } from '@/app/(auxiliary)/types/AppTypes/NotificationTypes';
import parse from "html-react-parser"

interface PropsType {
    notice: NotificationType;
    removeNotificationClick: (id: string) => void;
}

const borderStatuses = {
    "warning": styles.notificationWarning,
    "error": styles.notificationError,
    "success": styles.notificationSuccess
}

const NotificationItem: FC<PropsType> = ({
    notice,
    removeNotificationClick
}) => {
    return (
        <div className={`${styles.notification} ${borderStatuses[notice.type]}`} onClick={() => removeNotificationClick(notice.id)}>
            <Text>{parse(notice.message)}</Text>
        </div>
    )
}

export default NotificationItem
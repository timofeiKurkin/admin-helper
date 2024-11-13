import React, { FC } from 'react'
import Text from '../../../UI/TextTemplates/Text';
import styles from "../NotificationBlock.module.scss";
import { NotificationType } from '@/app/(auxiliary)/types/AppTypes/NotificationTypes';
import parse from "html-react-parser"
import { motion, Variants } from "framer-motion"
import Close from '../../../UI/SVG/Close/Close';

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

    const variants: Variants = {
        hidden: {
            opacity: 0, x: "100%", transition: { when: "afterChildren", type: "spring", bounce: 0.25 }
        },
        visible: {
            opacity: 1, x: 0, transition: { when: "beforeChildren", type: "spring", bounce: 0.25 }
        },
    }

    return (
        <motion.div className={`${styles.notification} ${borderStatuses[notice.type]}`}
            variants={variants}
            initial={"hidden"}
            exit={"hidden"}
            animate={"visible"}
            onClick={() => removeNotificationClick(notice.id)}>
            <div className={styles.notificationContent}>
                <Text>{parse(notice.message)}</Text>
            </div>
            <Close className={styles.notificationClose} />
        </motion.div>
    )
}

export default NotificationItem
"use client"

import { useAppDispatch, useAppSelector } from '@/app/(auxiliary)/libs/redux-toolkit/store/hooks'
import { deleteNotification, selectNotificationList } from '@/app/(auxiliary)/libs/redux-toolkit/store/slices/AppSlice/AppSlice'
import React, { useEffect } from 'react'
import Text from '../../UI/TextTemplates/Text'
import styles from "./NotificationBlock.module.scss";
import NotificationItem from './NotificationItem/NotificationItem'
import { NotificationType } from '@/app/(auxiliary)/types/AppTypes/NotificationTypes'

const NotificationBlock = () => {
    const dispatch = useAppDispatch()
    const notificationList = useAppSelector(selectNotificationList)

    useEffect(() => {
        notificationList.forEach((notice) => {
            const timer = setTimeout(() => {
                dispatch(deleteNotification({ id: notice.id }))
            }, notice.timeout)

            return () => clearTimeout(timer)
        })
    }, [
        notificationList,
        dispatch
    ])

    const removeNotificationClick = (id: string) => {
        dispatch(deleteNotification({ id }))
    }

    const exampleNotification: NotificationType = {
        id: "asdsd",
        type: "success",
        timeout: 30000,
        message: "Ваша заявка <b>#123</b> успешно создана и будет рассмотрена в ближайшее время.<br/>Вы можете посмотреть её в <b>ваших заявках</b>."
        // message: "Файлы успешно добавлены!"
    }

    return (
        <div className={styles.notificationBlock}>
            {notificationList.map((notice) => (
                <NotificationItem key={`key=${notice.id}`}
                    notice={notice}
                    removeNotificationClick={removeNotificationClick} />
            ))}
        </div>
    )
}

export default NotificationBlock;
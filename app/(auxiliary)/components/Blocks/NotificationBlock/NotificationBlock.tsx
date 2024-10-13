"use client"

import { useAppDispatch, useAppSelector } from '@/app/(auxiliary)/libs/redux-toolkit/store/hooks'
import { deleteNotification, selectNotificationList } from '@/app/(auxiliary)/libs/redux-toolkit/store/slices/AppSlice/AppSlice'
import React, { useEffect } from 'react'
import Text from '../../UI/TextTemplates/Text'
import styles from "./NotificationBlock.module.scss";

const NotificationBlock = () => {
    const dispatch = useAppDispatch()
    const notificationList = useAppSelector(selectNotificationList)

    useEffect(() => {
        notificationList.forEach((notice) => {
            const timer = setTimeout(() => {
                dispatch(deleteNotification({id: notice.id}))
            }, notice.timeout)

            return () => clearTimeout(timer)
        })
    }, [
        notificationList,
        dispatch
    ])

    const removeNotificationClick = (id: string) => {
        dispatch(deleteNotification({id}))
    }

    return (
        <div className={styles.notificationBlock}>
            {notificationList.map((notice) => (
                <div key={`key=${notice.id}`} className={styles.notification} onClick={() => removeNotificationClick(notice.id)}>
                    <Text>{notice.message}</Text>
                </div>
            ))}
        </div>
    )
}

export default NotificationBlock;
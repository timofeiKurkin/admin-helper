"use client"

import { useAppDispatch, useAppSelector } from '@/app/(auxiliary)/libs/redux-toolkit/store/hooks'
import { deleteNotification, selectNotificationList } from '@/app/(auxiliary)/libs/redux-toolkit/store/slices/AppSlice/AppSlice'
import { NotificationType } from '@/app/(auxiliary)/types/AppTypes/NotificationTypes'
import { FC, useEffect } from 'react'
import styles from "./NotificationBlock.module.scss"
import NotificationItem from './NotificationItem/NotificationItem'
import { AnimatePresence } from 'framer-motion'

const NotificationBlock = () => {
    const dispatch = useAppDispatch()
    const notificationList = useAppSelector(selectNotificationList)

    useEffect(() => {
        notificationList.forEach((notice) => {
            if (notice.timeout > 0) {
                const timer = setTimeout(() => {
                    dispatch(deleteNotification({ id: notice.id }))
                }, notice.timeout)

                return () => clearTimeout(timer)
            }
        })
    }, [
        notificationList,
        dispatch
    ])

    const removeNotificationClick = (id: string) => {
        dispatch(deleteNotification({ id }))
    }

    // const exampleNotification: NotificationType = {
    //     id: "hello",
    //     type: "success",
    //     timeout: 30000,
    //     message: "Ваша заявка <b>#123</b> успешно создана и будет рассмотрена в ближайшее время.<br/>Вы можете посмотреть её в <b>ваших заявках</b>."
    // }

    return (
        <div className={styles.notificationBlock}>
            <AnimatePresence mode="sync">
                {notificationList.map((notice, index) => (
                    <NotificationItem key={`key=${index}`}
                        index={index}
                        notice={notice}
                        removeNotificationClick={removeNotificationClick} />
                ))}
            </AnimatePresence>
        </div>
    )
}

export default NotificationBlock;
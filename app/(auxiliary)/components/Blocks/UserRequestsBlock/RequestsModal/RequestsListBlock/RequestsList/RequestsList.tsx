import { useAppSelector } from '@/app/(auxiliary)/libs/redux-toolkit/store/hooks'
import { selectUserRequests } from '@/app/(auxiliary)/libs/redux-toolkit/store/slices/UserRequestsSlice/UserRequestsSlice'
import React from 'react'
import EmptyRequestList from './EmptyRequestList/EmptyRequestList'
import RequestItem from './RequestItem/RequestItem'
import styles from "./RequestsList.module.scss"

const RequestsList = () => {
    const userRequests = useAppSelector(selectUserRequests)

    const testRequests = [
        { id: 1, createdAt: "", isCompleted: false },
        { id: 2, createdAt: "", isCompleted: true },
        { id: 3, createdAt: "", isCompleted: true }
    ]

    return userRequests.length ? (
        <div className={styles.requestsList}>
            {[...testRequests, ...userRequests].map((item) => (
                <RequestItem key={`key=${item.id}`} request={item} />
            ))}
        </div>
    ) : (
        <div className={styles.emptyRequestList}>
            <EmptyRequestList />
        </div>
    )
}

export default RequestsList
import {useAppSelector} from '@/app/(auxiliary)/libs/redux-toolkit/store/hooks'
import {selectUserRequests} from '@/app/(auxiliary)/libs/redux-toolkit/store/slices/UserRequestsSlice/UserRequestsSlice'
import React from 'react'
import EmptyRequestList from './EmptyRequestList/EmptyRequestList'
import RequestItem from './RequestItem/RequestItem'
import styles from "./RequestsList.module.scss"

const RequestsList = () => {
    const userRequests = useAppSelector(selectUserRequests)

    return userRequests.length ? (
        <div className={styles.requestsList}>
            {userRequests.map((item) => (
                <RequestItem key={`key=${item.id}`} request={item}/>
            ))}
        </div>
    ) : (
        <div className={styles.emptyRequestList}>
            <EmptyRequestList/>
        </div>
    )
}

export default RequestsList
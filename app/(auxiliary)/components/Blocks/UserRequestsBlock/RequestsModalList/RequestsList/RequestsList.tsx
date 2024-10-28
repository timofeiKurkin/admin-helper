import React, { FC } from 'react'
import { useAppSelector } from '@/app/(auxiliary)/libs/redux-toolkit/store/hooks'
import { selectUserRequests } from '@/app/(auxiliary)/libs/redux-toolkit/store/slices/UserRequestsSlice/UserRequestsSlice'
import styles from "./RequestsList.module.scss"
import SeparatingLine from '@/app/(auxiliary)/components/UI/SeparatingLine/SeparatingLine'
import { black } from '@/styles/colors'
import HeadTableRequestsList from './HeadTableRequestsList/HeadTableRequestsList'

const RequestsList: FC = () => {
    const userRequests = useAppSelector(selectUserRequests)

    return (
        <div className={styles.requestsListWrapper}>
            <HeadTableRequestsList />

            <SeparatingLine className={styles.separatedLine} style={{ width: "100%", height: 2, backgroundColor: black }} />

            <div> 2</div>
        </div>
    )
}

export default RequestsList;
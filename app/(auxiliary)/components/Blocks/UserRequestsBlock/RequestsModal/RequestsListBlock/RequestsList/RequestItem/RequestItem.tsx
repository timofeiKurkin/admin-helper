import { HelpRequestItemType } from '@/app/(auxiliary)/types/UserRequestsTypes/UserRequestsTypes'
import React, { FC } from 'react'
import tableStyle from "../../RequestsListBlock.module.scss"
import Text from '@/app/(auxiliary)/components/UI/TextTemplates/Text'
import styles from "./RequestItem.module.scss"

interface PropsType {
    request: HelpRequestItemType;
}

const RequestItem: FC<PropsType> = ({ request }) => {
    return (
        <div className={`${styles.requestItemWrapper} ${tableStyle.headTableGrid} ${request.is_completed ? styles.requestItemCompeted : styles.requestItemPending}`}>
            <Text>{request.id}</Text>
            <Text>{request.created_at}</Text>
            <Text>{request.is_completed ? "Выполнена" : "Выполняется"}</Text>
        </div>
    )
}

export default RequestItem
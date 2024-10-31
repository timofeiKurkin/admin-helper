import React, { FC } from 'react'
import styles from "./CompleteRequestBlock.module.scss"
import CompleteRequestHeader from './CompleteRequestHeader/CompleteRequestHeader'
import CompleteRequestBody from './CompleteRequestBody/CompleteRequestBody'
import Text from '../../../UI/TextTemplates/Text'
import { HelpRequestForOperatorType } from '@/app/(auxiliary)/types/OperatorTypes/OperatorTypes'
import completeRequestData from "@/data/interface/complete-request-page/data.json"
import SeparatingLine from '../../../UI/SeparatingLine/SeparatingLine'
import { black } from '@/styles/colors'


interface PropsType {
    request: HelpRequestForOperatorType;
}

const CompleteRequestBlock: FC<PropsType> = ({ request }) => {
    const helpfulText = completeRequestData.helpfulText

    return (
        <div className={styles.completeRequestWrapper}>
            <div className={styles.completeRequestModal}>
                <CompleteRequestHeader headerOfRequest={{ id: request.id, isCompleted: request.isCompleted }} />
                <SeparatingLine className={styles.separatedLine} style={{ width: "100%", height: 2, backgroundColor: black }} />
                <CompleteRequestBody bodyOfRequest={request} />
            </div>

            <div className={styles.helpfulMessage}>
                <Text>{helpfulText}</Text>
            </div>
        </div>
    )
}

export default CompleteRequestBlock
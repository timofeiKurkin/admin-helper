import React, { FC } from 'react'
import completeRequestData from "@/data/interface/complete-request-page/data.json"
import { HeaderRequestType } from '@/app/(auxiliary)/types/Data/Interface/CompleteRequestDataType/CompleteRequestDataType';
import Title from '@/app/(auxiliary)/components/UI/TextTemplates/Title';
import styles from "./CompleteRequestHeader.module.scss"
import Text from '@/app/(auxiliary)/components/UI/TextTemplates/Text';
import { RequestHeaderPropsType } from '@/app/(auxiliary)/types/OperatorTypes/OperatorTypes';

interface PropsType {
    headerOfRequest: RequestHeaderPropsType;
}

const CompleteRequestHeader: FC<PropsType> = ({ headerOfRequest }) => {
    const header: HeaderRequestType = completeRequestData.header

    return (
        <div className={styles.completeRequestHeaderWrapper}>
            <div className={styles.requestNumber}>
                <Text>{header.title}</Text>

                <Title>{header.request} #{headerOfRequest.id}</Title>
            </div>

            <div className={styles.requestStatus}>
                <Text>{header.status.statusTitle}</Text>
                <div className={styles.requestStatusValue}>
                    <span className={`${styles.requestStatusEllipse} ${headerOfRequest.isCompleted ? styles.requestStatusEllipseDone : styles.requestStatusEllipsePending}`}></span>
                    <Text style={{ fontWeight: 500 }}>
                        {headerOfRequest.isCompleted ? header.status.completed : header.status.uncompleted}
                    </Text>
                </div>
            </div>
        </div>
    )
}

export default CompleteRequestHeader
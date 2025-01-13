import Text from '@/app/(auxiliary)/components/UI/TextTemplates/Text'
import { BodyRequestType } from '@/app/(auxiliary)/types/Data/Interface/CompleteRequestDataType/CompleteRequestDataType'
import { RequestBodyItemType, RequestBodyKeysType, RequestBodyPropsType } from '@/app/(auxiliary)/types/OperatorTypes/OperatorTypes'
import completeRequestData from "@/data/interface/complete-request-page/data.json"
import { FC } from 'react'
import styles from "./CompleteRequestBody.module.scss";


interface PropsType {
    bodyOfRequest: RequestBodyPropsType;
}

const CompleteRequestBody: FC<PropsType> = ({ bodyOfRequest }) => {
    const completeData: BodyRequestType = completeRequestData.body
    const bodyObject: RequestBodyItemType[] = []

    for (const key of Object.keys(bodyOfRequest) as RequestBodyKeysType) {
        if (key in completeData.itemsInfo && key in bodyOfRequest) {
            bodyObject.push({
                text: completeData.itemsInfo[key],
                value: bodyOfRequest[key]
            })
        }
    }

    return (
        <div className={styles.completeRequestBodyWrapper}>
            <Text style={{ fontWeight: 500 }}>{completeData.commonInfo}</Text>

            <div className={styles.completeRequestBodyList}>
                {bodyObject.map((item) => (
                    <div key={`key=${item.text}`} className={styles.completeRequestBodyItem}>
                        <Text>{item.text}</Text>
                        <Text style={{ fontWeight: 500 }}>{item.value}</Text>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default CompleteRequestBody
import { HelpRequestForOperatorType } from '@/app/(auxiliary)/types/OperatorTypes/OperatorTypes'
// import completeRequestData from "@/data/interface/complete-request-page/data.json"
import { black, blue_dark } from '@/styles/colors'
import { FC } from 'react'
import SeparatingLine from '../../../UI/SeparatingLine/SeparatingLine'
import Text from '../../../UI/TextTemplates/Text'
import styles from "./CompleteRequestBlock.module.scss"
import CompleteRequestBody from './CompleteRequestBody/CompleteRequestBody'
import CompleteRequestHeader from './CompleteRequestHeader/CompleteRequestHeader'
import Button from '../../../UI/Button/Button'


interface PropsType {
    request: HelpRequestForOperatorType;
}

const CompleteRequestBlock: FC<PropsType> = ({ request }) => {
    // const helpfulText = completeRequestData

    return (
        <div className={styles.completeRequestWrapper}>
            <div className={styles.completeRequestModal}>
                <CompleteRequestHeader headerOfRequest={{ id: request.id, isCompleted: request.isCompleted }} />
                <SeparatingLine className={styles.separatedLine} style={{ width: "100%", height: 2, backgroundColor: black }} />
                <CompleteRequestBody bodyOfRequest={request} />
                <SeparatingLine className={styles.separatedLine} style={{ width: "100%", height: 2, backgroundColor: black }} />
                <Button className={styles.removeButton}>Удалить заявку</Button>
            </div>
        </div>
    )
}

export default CompleteRequestBlock
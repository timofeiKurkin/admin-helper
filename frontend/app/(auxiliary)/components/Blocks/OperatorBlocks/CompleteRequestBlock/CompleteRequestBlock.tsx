import { HelpRequestForOperatorType } from '@/app/(auxiliary)/types/OperatorTypes/OperatorTypes'
// import completeRequestData from "@/data/interface/complete-request-page/data.json"
import { grey } from '@/styles/colors'
import { FC, useState } from 'react'
import SeparatingLine from '../../../UI/SeparatingLine/SeparatingLine'
import Text from '../../../UI/TextTemplates/Text'
import styles from "./CompleteRequestBlock.module.scss"
import CompleteRequestBody from './CompleteRequestBody/CompleteRequestBody'
import CompleteRequestHeader from './CompleteRequestHeader/CompleteRequestHeader'
import Button from '../../../UI/Button/Button'
import DeleteUserRequest from './DeleteUserRequest/DeleteUserRequest'
import Title from '../../../UI/TextTemplates/Title'
import TextMedium from '../../../UI/TextTemplates/TextMedium'


interface PropsType {
    request: HelpRequestForOperatorType;
    request_url: string;
}

const CompleteRequestBlock: FC<PropsType> = ({ request, request_url }) => {
    const [requestIsDeleted, setRequestIsDeleted] = useState(false)
    const changeDeleteStatus = () => setRequestIsDeleted((prevState) => !prevState)

    return (
        <div className={styles.completeRequestWrapper}>
            <div className={styles.completeRequestModal}>
                <CompleteRequestHeader headerOfRequest={{ id: request.id, isCompleted: request.isCompleted }} />

                <SeparatingLine className={styles.separatedLine} style={{ width: "100%", height: 2, backgroundColor: grey }} />

                <CompleteRequestBody bodyOfRequest={request} />

                <SeparatingLine className={styles.separatedLine} style={{ width: "100%", height: 2, backgroundColor: grey }} />

                {!requestIsDeleted ?
                    <DeleteUserRequest request_url={request_url} changeDeleteStatus={changeDeleteStatus} /> : (
                        <div className={styles.deletedRequest}>
                            <TextMedium>Заявка успешно удалена!</TextMedium>
                        </div>
                    )}
            </div>
        </div>
    )
}

export default CompleteRequestBlock
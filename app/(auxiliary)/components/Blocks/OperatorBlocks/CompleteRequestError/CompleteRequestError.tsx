import React, { FC } from 'react'
import styles from "./CompleteRequestError.module.scss"
import commonStyles from "../CompleteRequestBlock/CompleteRequestBlock.module.scss"
import Title from '../../../UI/TextTemplates/Title'
import Text from '../../../UI/TextTemplates/Text'
import { black } from '@/styles/colors';
import SeparatingLine from '../../../UI/SeparatingLine/SeparatingLine';
import TextMedium from '../../../UI/TextTemplates/TextMedium'

interface PropsType {
    code: number;
    message: string;
}

const CompleteRequestError: FC<PropsType> = ({ code, message }) => {
    return (
        <div className={styles.completeRequestErrorWrapper}>
            <div className={styles.completeRequestErrorModal}>
                <Title>Ошибка при завершении заявки!</Title>

                <SeparatingLine className={commonStyles.separatedLine} style={{ width: "100%", height: 2, backgroundColor: black }} />

                <div className={styles.requestErrorDescription}>
                    <div className={styles.requestErrorCode}>
                        <TextMedium>Код ошибки: </TextMedium><Text>{code}</Text>
                    </div>
                    <div className={styles.requestErrorMessage}>
                        <TextMedium>Сообщение: </TextMedium>
                        <Text>{message}</Text>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CompleteRequestError
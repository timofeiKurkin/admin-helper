import React, { FC } from 'react'
import styles from "./CompleteRequestError.module.scss"
import Title from '../../../UI/TextTemplates/Title'
import Text from '../../../UI/TextTemplates/Text'

interface PropsType {
    code: number;
    message: string;
}

const CompleteRequestError: FC<PropsType> = ({ code, message }) => {
    return (
        <div className={styles.completeRequestErrorWrapper}>
            <div className={styles.completeRequestErrorModal}>
                <Title>Ошибка при завершении заявки!</Title>
                <Text>Код ошибки: {code}</Text>
                <Text>Сообщение: {message}</Text>
            </div>
        </div>
    )
}

export default CompleteRequestError
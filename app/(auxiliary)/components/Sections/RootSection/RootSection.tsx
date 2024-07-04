import React from 'react'
import styles from './RootSection.module.scss'
import MainTitle from '../../UI/TextTemplates/MainTitle'

export default function RootSection() {

    return (
        <div className={styles.body}>
            <MainTitle>Создать новую заявку для технической помощи</MainTitle>
        </div>
    )
}

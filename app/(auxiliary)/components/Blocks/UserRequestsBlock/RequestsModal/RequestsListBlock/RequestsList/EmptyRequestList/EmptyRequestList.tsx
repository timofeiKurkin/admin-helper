import Title from '@/app/(auxiliary)/components/UI/TextTemplates/Title'
import React from 'react'

const EmptyRequestList = () => {
    return (
        <Title styles={{ textAlign: "center" }}>
            У вас не ни одной заявки о технической помощи
        </Title>
    )
}

export default EmptyRequestList
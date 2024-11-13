import Title from '@/app/(auxiliary)/components/UI/TextTemplates/Title'
import React from 'react'
import rootData from "@/data/interface/root-page/data.json"

const EmptyRequestList = () => {
    return (
        <Title styles={{ textAlign: "center" }}>
            {rootData.userRequests.modalData.thereNoRequest}
        </Title>
    )
}

export default EmptyRequestList
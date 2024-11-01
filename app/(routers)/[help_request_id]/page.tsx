import CompleteRequest from '@/app/(auxiliary)/components/Sections/OperatorSection/CompleteRequest/CompleteRequest';
import React, { FC } from 'react'
import { notFound } from 'next/navigation';

interface PropsType {
    params: {
        help_request_id: string;
    }
}

// const LazyCompleteRequest = dynamic(() => import('@/app/(auxiliary)/components/Sections/OperatorSection/CompleteRequest/CompleteRequest'), { ssr: false, loading: () => <div>Loading data...</div> })

const ChangeUserRequestPage: FC<PropsType> = ({ params }) => {
    const help_request_id = params.help_request_id

    if (help_request_id.length !== 43) {
        notFound()
    }

    return (
        <CompleteRequest accept_url={help_request_id} />
    )
}

export default ChangeUserRequestPage;
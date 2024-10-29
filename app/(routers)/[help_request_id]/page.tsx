import React, { FC } from 'react'

interface PropsType {
    params: {
        help_request_id: string;
    }
}

const ChangeUserRequestPage: FC<PropsType> = ({ params }) => {

    return (
        <div>page</div>
    )
}

export default ChangeUserRequestPage;
import React, {FC} from 'react'
import { ModalDataType } from '@/app/(auxiliary)/types/Data/Interface/RootPage/RootPageContentType'

interface PropsType {
    modalData: ModalDataType;
}

const RequestsModalList: FC<PropsType> = ({modalData}) => {
    return (
        <div>RequestsModalList</div>
    )
}

export default RequestsModalList
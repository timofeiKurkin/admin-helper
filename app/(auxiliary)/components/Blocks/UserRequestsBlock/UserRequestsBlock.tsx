import React, { useState } from 'react'
import Button from '../../UI/Button/Button'
import RequestsModalList from './RequestsModalList/RequestsModalList'
import rootData from "@/data/interface/root-page/data.json"
import { UserRequestsType } from '@/app/(auxiliary)/types/Data/Interface/RootPage/RootPageContentType'
import BulletList from '../../UI/SVG/BulletList/BulletList'
import { ButtonImageProps } from '@/app/(auxiliary)/types/AppTypes/AppTypes'
import styles from "./UserRequestsBlock.module.scss";
import { useAppDispatch, useAppSelector } from '@/app/(auxiliary)/libs/redux-toolkit/store/hooks'
import { changeRequestsModalVisibility, selectRequestsModalIsOpen } from '@/app/(auxiliary)/libs/redux-toolkit/store/slices/UserRequestsSlice/UserRequestsSlice'

const UserRequestsBlock = () => {
    const dispatch = useAppDispatch()
    const requestsModalIsOpen = useAppSelector(selectRequestsModalIsOpen)

    const userRequestData: UserRequestsType = rootData.userRequests
    const imageProps: ButtonImageProps = {
        position: "left",
        visibleOnlyImage: false,
        children: <BulletList />
    }
    // const [requestListIsOpen, setRequestListIsOpen] = useState(false)

    const requestModalVisibilityHandler = () => {
        dispatch(changeRequestsModalVisibility())
    }

    return (
        <div className={styles.userRequestsWrapper}>
            <Button onClick={requestModalVisibilityHandler} image={imageProps} className={styles.userRequestsButton}>
                {userRequestData.button}
            </Button>

            {requestsModalIsOpen ? (
                <RequestsModalList modalData={userRequestData.modalData} />
            ) : null}
        </div>
    )
}

export default UserRequestsBlock
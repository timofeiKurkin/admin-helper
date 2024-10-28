import React, { FC, useEffect } from 'react'
import { ModalDataType } from '@/app/(auxiliary)/types/Data/Interface/RootPage/RootPageContentType'
import PopupDisableScroll from '../../../Common/Popups/PopupsWrapper/PopupDisableScroll/PopupDisableScroll';
import Backdrop from '../../../UI/Wrappers/Backdrop/Backdrop';
import RequestsList from './RequestsList/RequestsList';
import styles from "./RequestsModalList.module.scss"
import Title from '../../../UI/TextTemplates/Title';
import { useAppDispatch } from '@/app/(auxiliary)/libs/redux-toolkit/store/hooks';
import { changeRequestsModalVisibility } from '@/app/(auxiliary)/libs/redux-toolkit/store/slices/UserRequestsSlice/UserRequestsSlice';
import Close from '../../../UI/SVG/Close/Close';

interface PropsType {
    modalData: ModalDataType;
}

const RequestsModalList: FC<PropsType> = ({ modalData }) => {
    const dispatch = useAppDispatch()

    const requestModalVisibilityHandler = () => {
        dispatch(changeRequestsModalVisibility())
    }

    useEffect(() => {
        // TODO: made request to backend to get user's help requests
    }, [])

    return (
        <PopupDisableScroll>
            <Backdrop onBackdropClick={requestModalVisibilityHandler}>
                <div className={styles.requestsModalListWrapper}
                    onClick={(e) => e.stopPropagation()}>
                    <div className={styles.requestsModalListBody}>
                        <div className={styles.requestsModalTitle}>
                            <Title>{modalData.title}</Title>
                            <Close />
                        </div>

                        <RequestsList />
                    </div>
                </div>
            </Backdrop>
        </PopupDisableScroll>
    )
}

export default RequestsModalList
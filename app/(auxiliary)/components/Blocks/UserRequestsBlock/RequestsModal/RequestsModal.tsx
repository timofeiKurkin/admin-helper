import { useAppDispatch } from '@/app/(auxiliary)/libs/redux-toolkit/store/hooks';
import { changeRequestsModalVisibility } from '@/app/(auxiliary)/libs/redux-toolkit/store/slices/UserRequestsSlice/UserRequestsSlice';
import { ModalDataType } from '@/app/(auxiliary)/types/Data/Interface/RootPage/RootPageContentType';
import { FC } from 'react';
import PopupDisableScroll from '../../../Common/Popups/PopupsWrapper/PopupDisableScroll/PopupDisableScroll';
import Close from '../../../UI/SVG/Close/Close';
import Title from '../../../UI/TextTemplates/Title';
import Backdrop from '../../../UI/Wrappers/Backdrop/Backdrop';
import RequestsListBlock from './RequestsListBlock/RequestsListBlock';
import styles from "./RequestsModal.module.scss"

interface PropsType {
    modalData: ModalDataType;
}

const RequestsModal: FC<PropsType> = ({ modalData }) => {
    const dispatch = useAppDispatch()

    const requestModalVisibilityHandler = () => {
        dispatch(changeRequestsModalVisibility())
    }

    return (
        <PopupDisableScroll>
            <Backdrop onBackdropClick={requestModalVisibilityHandler}>
                <div className={styles.requestsModalListWrapper}
                    onClick={(e) => e.stopPropagation()}>
                    <div className={styles.requestsModalListBody}>
                        <div className={styles.requestsModalTitle}>
                            <Title>{modalData.title}</Title>

                            <div className={styles.requestModalClose} onClick={requestModalVisibilityHandler}>
                                <Close />
                            </div>
                        </div>

                        <RequestsListBlock />
                    </div>
                </div>
            </Backdrop>
        </PopupDisableScroll>
    )
}

export default RequestsModal
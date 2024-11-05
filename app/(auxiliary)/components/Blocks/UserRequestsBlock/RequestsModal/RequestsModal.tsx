import { useAppDispatch, useAppSelector } from '@/app/(auxiliary)/libs/redux-toolkit/store/hooks';
import { changeRequestsModalVisibility } from '@/app/(auxiliary)/libs/redux-toolkit/store/slices/UserRequestsSlice/UserRequestsSlice';
import { ModalDataType } from '@/app/(auxiliary)/types/Data/Interface/RootPage/RootPageContentType';
import { FC } from 'react';
import PopupDisableScroll from '../../../Common/Popups/PopupsWrapper/PopupDisableScroll/PopupDisableScroll';
import Close from '../../../UI/SVG/Close/Close';
import Title from '../../../UI/TextTemplates/Title';
import Backdrop from '../../../UI/Wrappers/Backdrop/Backdrop';
import RequestsListBlock from './RequestsListBlock/RequestsListBlock';
import styles from "./RequestsModal.module.scss"
import Button from '../../../UI/Button/Button';
import { selectUserDevice } from '@/app/(auxiliary)/libs/redux-toolkit/store/slices/AppSlice/AppSlice';
import Text from '../../../UI/TextTemplates/Text';
import { black } from '@/styles/colors';
import SeparatingLine from '../../../UI/SeparatingLine/SeparatingLine';

interface PropsType {
    modalData: ModalDataType;
}

const RequestsModal: FC<PropsType> = ({ modalData }) => {
    const dispatch = useAppDispatch()

    const requestModalVisibilityHandler = () => {
        dispatch(changeRequestsModalVisibility())
    }

    const getMoreRequests = () => {

    }

    return (
        <PopupDisableScroll>
            <Backdrop onBackdropClick={requestModalVisibilityHandler}>
                <div className={styles.requestsModalListWrapper}
                    onClick={(e) => e.stopPropagation()}>
                    <div className={styles.requestsModalListBody}>
                        <div className={styles.requestsModalTitle}>
                            <Title>{modalData.title}</Title>

                            {/* <div className={styles.requestModalClose} onClick={requestModalVisibilityHandler}>
                                <Close className={styles.closeButton} />
                            </div> */}
                        </div>

                        <RequestsListBlock />

                        <div className={styles.getMoreRequests}>
                            <div className={styles.getMoreRequestsButton} onClick={getMoreRequests}>
                                <Text style={{ fontWeight: 500 }}>{modalData.getMoreRequests}</Text>
                            </div>

                            <SeparatingLine style={{ width: "100%", backgroundColor: black }} />
                        </div>

                        <Button onClick={requestModalVisibilityHandler}>
                            Закрыть
                        </Button>
                    </div>
                </div>
            </Backdrop>
        </PopupDisableScroll>
    )
}

export default RequestsModal
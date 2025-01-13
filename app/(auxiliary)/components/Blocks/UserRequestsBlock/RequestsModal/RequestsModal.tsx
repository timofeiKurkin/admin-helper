import { useAppDispatch } from '@/app/(auxiliary)/libs/redux-toolkit/store/hooks';
import { changeRequestsModalVisibility } from '@/app/(auxiliary)/libs/redux-toolkit/store/slices/UserRequestsSlice/UserRequestsSlice';
import { ModalDataType } from '@/app/(auxiliary)/types/Data/Interface/RootPage/RootPageContentType';
import { motion, Variants } from "framer-motion";
import { FC } from 'react';
import PopupDisableScroll from '../../../Common/Popups/PopupsWrapper/PopupDisableScroll/PopupDisableScroll';
import Button from '../../../UI/Button/Button';
import Title from '../../../UI/TextTemplates/Title';
import Backdrop from '../../../UI/Wrappers/Backdrop/Backdrop';
import RequestsListBlock from './RequestsListBlock/RequestsListBlock';
import styles from "./RequestsModal.module.scss";
import SeparatingLine from '../../../UI/SeparatingLine/SeparatingLine';
import { black } from '@/styles/colors';

interface PropsType {
    modalData: ModalDataType;
}

const RequestsModal: FC<PropsType> = ({ modalData }) => {
    const dispatch = useAppDispatch()

    const requestModalVisibilityHandler = () => {
        dispatch(changeRequestsModalVisibility())
    }

    const variants: Variants = {
        hidden: {
            opacity: 0, x: "100%", transition: { type: "tween" }
        },
        visible: {
            opacity: 1, x: 0, transition: { type: "tween" }
        },
    }

    return (
        <PopupDisableScroll>
            <Backdrop onBackdropClick={requestModalVisibilityHandler}>
                <motion.div className={styles.requestsModalListWrapper}
                    transition={{ type: "linear" }}
                    variants={variants}
                    initial={"hidden"}
                    animate={"visible"}
                    exit={"hidden"}
                    onClick={(e) => e.stopPropagation()}>
                    <div className={styles.requestsModalListBody}>
                        <div className={styles.requestsModalTitle}>
                            <Title>{modalData.title}</Title>
                        </div>

                        <RequestsListBlock />

                        <SeparatingLine style={{ width: "100%", backgroundColor: black }} />

                        <Button onClick={requestModalVisibilityHandler}>
                            Закрыть
                        </Button>
                    </div>
                </motion.div>
            </Backdrop>
        </PopupDisableScroll>
    )
}

export default RequestsModal
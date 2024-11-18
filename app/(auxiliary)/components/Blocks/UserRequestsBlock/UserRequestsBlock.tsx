import { useAppDispatch, useAppSelector } from '@/app/(auxiliary)/libs/redux-toolkit/store/hooks'
import { changeRequestsModalVisibility, selectRequestsModalIsOpen, selectUserIsAuthorized } from '@/app/(auxiliary)/libs/redux-toolkit/store/slices/UserRequestsSlice/UserRequestsSlice'
import { ButtonImageProps } from '@/app/(auxiliary)/types/AppTypes/AppTypes'
import { UserRequestsType } from '@/app/(auxiliary)/types/Data/Interface/RootPage/RootPageContentType'
import rootData from "@/data/interface/root-page/data.json"
import Button from '../../UI/Button/Button'
import BulletList from '../../UI/SVG/BulletList/BulletList'
import RequestsModal from './RequestsModal/RequestsModal'
import styles from "./UserRequestsBlock.module.scss"
import { setNewNotification } from '@/app/(auxiliary)/libs/redux-toolkit/store/slices/AppSlice/AppSlice'
import { AnimatePresence, Variants, motion } from 'framer-motion'
import ModalWrapper from '../../UI/Wrappers/ModalWrapper/ModalWrapper'

const UserRequestsBlock = () => {
    const dispatch = useAppDispatch()
    const userIsAuthorized = useAppSelector(selectUserIsAuthorized)
    const requestsModalIsOpen = useAppSelector(selectRequestsModalIsOpen)

    const userRequestData: UserRequestsType = rootData.userRequests
    const imageProps: ButtonImageProps = {
        position: "left",
        visibleOnlyImage: false,
        children: <BulletList />
    }

    const requestModalVisibilityHandler = (authorizationStatus: boolean) => {
        if (authorizationStatus) {
            dispatch(changeRequestsModalVisibility())
        } else {
            dispatch(setNewNotification({
                message: "Вам нужно отправить хотя бы одну заявку, чтобы увидеть полный список 😉",
                type: "warning",
                timeout: 5000
            }))
        }
    }

    const variants: Variants = {
        hidden: {
            opacity: 0, transition: { when: "afterChildren", type: "tween" }
        },
        visible: {
            opacity: 1, transition: { when: "beforeChildren", type: "tween" }
        },
    }

    return (
        <div className={styles.userRequestsWrapper}>
            <Button onClick={() => requestModalVisibilityHandler(userIsAuthorized)}
                image={imageProps}
                className={styles.userRequestsButton}>
                {userRequestData.button}
            </Button>
            <ModalWrapper>
                <AnimatePresence mode={"wait"}>
                    {requestsModalIsOpen ? (
                        <motion.div variants={variants} initial={"hidden"} exit={"hidden"} animate={"visible"}>
                            <RequestsModal modalData={userRequestData.modalData} />
                        </motion.div>
                    ) : null}
                </AnimatePresence>
            </ModalWrapper>
        </div>
    )
}

export default UserRequestsBlock
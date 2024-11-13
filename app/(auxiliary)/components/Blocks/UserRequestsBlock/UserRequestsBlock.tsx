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
import { AnimatePresence } from 'framer-motion'

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

    return (
        <div className={styles.userRequestsWrapper}>
            <Button onClick={() => requestModalVisibilityHandler(userIsAuthorized)}
                image={imageProps}
                className={styles.userRequestsButton}>
                {userRequestData.button}
            </Button>
            <AnimatePresence>
                {requestsModalIsOpen ? (
                    <RequestsModal modalData={userRequestData.modalData} />
                ) : null}
            </AnimatePresence>
        </div>
    )
}

export default UserRequestsBlock
import { useAppDispatch, useAppSelector } from '@/app/(auxiliary)/libs/redux-toolkit/store/hooks'
import { changeRequestsModalVisibility, selectRequestsModalIsOpen, selectUserIsAuthorized } from '@/app/(auxiliary)/libs/redux-toolkit/store/slices/UserRequestsSlice/UserRequestsSlice'
import { ButtonImageProps } from '@/app/(auxiliary)/types/AppTypes/AppTypes'
import { UserRequestsType } from '@/app/(auxiliary)/types/Data/Interface/RootPage/RootPageContentType'
import rootData from "@/data/interface/root-page/data.json"
import Button from '../../UI/Button/Button'
import BulletList from '../../UI/SVG/BulletList/BulletList'
import RequestsModal from './RequestsModal/RequestsModal'
import styles from "./UserRequestsBlock.module.scss"

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

    const requestModalVisibilityHandler = () => {
        dispatch(changeRequestsModalVisibility())
    }

    if (userIsAuthorized) {
        return (
            <div className={styles.userRequestsWrapper}>
                <Button onClick={requestModalVisibilityHandler} image={imageProps} className={styles.userRequestsButton}>
                    {userRequestData.button}
                </Button>
                {requestsModalIsOpen ? (
                    <RequestsModal modalData={userRequestData.modalData} />
                ) : null}
            </div>
        )
    }
}

export default UserRequestsBlock
import Button from '@/app/(auxiliary)/components/UI/Button/Button'
import React, { FC, useState } from 'react'
import styles from "./DeleteUserRequest.module.scss"
import { axiosRequestsHandler } from '@/app/(auxiliary)/func/axiosRequestsHandler';
import OperatorService from '@/app/(auxiliary)/libs/axios/services/OperatorService/OperatorService';
import { AxiosResponse } from 'axios';
import { useAppDispatch, useAppSelector } from '@/app/(auxiliary)/libs/redux-toolkit/store/hooks';
import { selectCsrfToken, setCsrfToken, setNewNotification } from '@/app/(auxiliary)/libs/redux-toolkit/store/slices/AppSlice/AppSlice';
import { AxiosErrorType } from '@/app/(auxiliary)/types/AxiosTypes/AxiosTypes';
import { DeleteRequestType } from '@/app/(auxiliary)/types/OperatorTypes/OperatorTypes';

interface PropsType {
    request_url: string;
    changeDeleteStatus: () => void
}

const DeleteUserRequest: FC<PropsType> = ({ request_url, changeDeleteStatus }) => {
    const dispatch = useAppDispatch()
    const csrfToken = useAppSelector(selectCsrfToken)
    const [acceptDelete, setAcceptDelete] = useState<boolean>(false)


    const deleteRequest = async (request_url: string, csrfToken: string) => {
        if (!csrfToken)
            return

        const response =
            await axiosRequestsHandler(OperatorService.delete_request(request_url, csrfToken))

        if ((response as AxiosResponse).status === 200) {
            const deletedResponse = response as AxiosResponse<DeleteRequestType>
            changeDeleteStatus()
            // dispatch(setCsrfToken({ csrfToken: deletedResponse.data.csrfToken }))
            if (deletedResponse.data?.message) {
                dispatch(setNewNotification({ message: deletedResponse.data.message, type: "success" }))
            }
        } else {
            const errorResponse = response as AxiosErrorType
            dispatch(setNewNotification({ message: `Не удалось удалить заявку: ${errorResponse.message}`, type: "error" }))
        }
    }

    const openAcceptsButton = () => {
        setAcceptDelete((prevState) => !prevState)
    }

    return (
        <div className={styles.deleteRequestWrapper}>
            {acceptDelete ? (
                <div className={styles.acceptWrapper}>
                    <Button onClick={openAcceptsButton} className={styles.cancelButton}>Отмена</Button>
                    <Button onClick={() => deleteRequest(request_url, csrfToken)} className={styles.acceptButton}>Подтвердить</Button>
                </div>
            ) : (
                <Button onClick={openAcceptsButton} className={styles.deleteButton}>Удалить заявку</Button>
            )}
        </div>
    )
}

export default DeleteUserRequest
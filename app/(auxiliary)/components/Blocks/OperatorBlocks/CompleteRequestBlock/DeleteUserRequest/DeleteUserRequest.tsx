import Button from '@/app/(auxiliary)/components/UI/Button/Button'
import React, { FC, useState } from 'react'
import styles from "./DeleteUserRequest.module.scss"
import { axiosRequestsHandler } from '@/app/(auxiliary)/func/axiosRequestsHandler';
import OperatorService from '@/app/(auxiliary)/libs/axios/services/OperatorService/OperatorService';
import { AxiosResponse } from 'axios';
import { useAppDispatch } from '@/app/(auxiliary)/libs/redux-toolkit/store/hooks';
import { setNewNotification } from '@/app/(auxiliary)/libs/redux-toolkit/store/slices/AppSlice/AppSlice';
import { AxiosErrorType } from '@/app/(auxiliary)/types/AxiosTypes/AxiosTypes';

interface PropsType {
    request_url: string;
    changeDeleteStatus: () => void
}

const DeleteUserRequest: FC<PropsType> = ({ request_url, changeDeleteStatus }) => {
    const dispatch = useAppDispatch()
    const [acceptDelete, setAcceptDelete] = useState<boolean>(false)


    const deleteRequest = async (request_url: string) => {
        const response =
            await axiosRequestsHandler(OperatorService.delete_request(request_url))

        if ((response as AxiosResponse).status === 204) {
            changeDeleteStatus()
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
                    <Button onClick={() => deleteRequest(request_url)} className={styles.acceptButton}>Подтвердить</Button>
                </div>
            ) : (
                <Button onClick={openAcceptsButton} className={styles.deleteButton}>Удалить заявку</Button>
            )}
        </div>
    )
}

export default DeleteUserRequest
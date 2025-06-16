"use client"

import {axiosRequestHandler} from '@/app/(auxiliary)/func/axiosRequestHandler'
import UserService from '@/app/(auxiliary)/libs/axios/services/UserService/UserService'
import {useAppDispatch, useAppSelector} from '@/app/(auxiliary)/libs/redux-toolkit/store/hooks'
import {
    selectCsrfToken,
    setCsrfToken,
    setNewNotification
} from '@/app/(auxiliary)/libs/redux-toolkit/store/slices/AppSlice/AppSlice'
import {ChildrenProp, CsrfTokenType} from '@/app/(auxiliary)/types/AppTypes/AppTypes'
import {AxiosErrorType} from '@/app/(auxiliary)/types/AxiosTypes/AxiosTypes'
import {AxiosResponse} from 'axios'
import {FC, useEffect} from 'react'

const CsrfToken: FC<ChildrenProp> = ({children}) => {
    const dispatch = useAppDispatch()
    const csrfToken = useAppSelector(selectCsrfToken)

    useEffect(() => {
        let active = true

        const getCsrfToken = async () => {
            const response = await axiosRequestHandler(() => UserService.getCsrfToken())

            if (active) {
                if ((response as AxiosResponse).status === 200) {
                    const successResponse = response as AxiosResponse<CsrfTokenType>
                    dispatch(setCsrfToken(successResponse.data))
                } else if ((response as AxiosErrorType).status >= 500) {
                    dispatch(setNewNotification({
                        message: "Ваш запрос не совсем безопасен. Обновите страницу 🔄, чтобы продолжить работу и отправить заявку без проблем. 😊",
                        type: "error"
                    }))
                }
            }
        }

        if (!csrfToken) {
            getCsrfToken().then()
        }

        return () => {
            active = false
        }
    }, [dispatch, csrfToken])

    if (csrfToken) {
        return children
    }
}

export default CsrfToken
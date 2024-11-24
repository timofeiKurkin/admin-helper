import { axiosRequestsHandler } from '@/app/(auxiliary)/func/axiosRequestsHandler'
import UserService from '@/app/(auxiliary)/libs/axios/services/UserService/UserService'
import { useAppDispatch } from '@/app/(auxiliary)/libs/redux-toolkit/store/hooks'
import { setCsrfToken, setNewNotification } from '@/app/(auxiliary)/libs/redux-toolkit/store/slices/AppSlice/AppSlice'
import { ChildrenProp, CsrfTokenType } from '@/app/(auxiliary)/types/AppTypes/AppTypes'
import { AxiosErrorType } from '@/app/(auxiliary)/types/AxiosTypes/AxiosTypes'
import { AxiosResponse } from 'axios'
import { FC, useEffect } from 'react'

const CsrfToken: FC<ChildrenProp> = ({ children }) => {
    const dispatch = useAppDispatch()

    useEffect(() => {
        let active = true

        const getCsrfToken = async () => {
            const response = await axiosRequestsHandler<UserService, CsrfTokenType>(UserService.getCsrfToken())

            if (active) {
                if ((response as AxiosResponse).status === 200) {
                    const successResponse = response as AxiosResponse<CsrfTokenType>
                    dispatch(setCsrfToken(successResponse.data))
                } else if ((response as AxiosErrorType).statusCode >= 500) {
                    dispatch(setNewNotification({
                        message: "Ваш запрос не совсем безопасен. Обновите страницу 🔄, чтобы продолжить работу и отправить заявку без проблем. 😊",
                        type: "error"
                    }))
                }
            }
        }

        getCsrfToken().then()

        return () => {
            active = false
        }
    }, [])

    return children
}

export default CsrfToken
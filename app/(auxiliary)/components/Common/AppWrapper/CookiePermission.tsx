"use client"

import { axiosRequestsHandler } from '@/app/(auxiliary)/func/axiosRequestsHandler'
import UserService from '@/app/(auxiliary)/libs/axios/services/UserService/UserService'
import { useAppDispatch } from '@/app/(auxiliary)/libs/redux-toolkit/store/hooks'
import { setCookiePermission, setNewNotification } from '@/app/(auxiliary)/libs/redux-toolkit/store/slices/AppSlice/AppSlice'
import { ChildrenProp, CookiePermissionResponseType } from '@/app/(auxiliary)/types/AppTypes/AppTypes'
import { AxiosResponse } from 'axios'
import { FC, useEffect, useState } from 'react'

const CookiePermission: FC<ChildrenProp> = ({ children }) => {
    const dispatch = useAppDispatch()
    const [cookiePermission, setCookiePermission] = useState<boolean>(false)

    useEffect(() => {
        let active = true

        const checkCookiePermission = async () => {
            const response = await axiosRequestsHandler(UserService.setCookiePermission())

            if ((response as AxiosResponse).status === 200) {
                const succeedResponse = response as AxiosResponse<CookiePermissionResponseType>
                setCookiePermission(succeedResponse.data.cookiePermission)
                if (succeedResponse.data?.message) {
                    dispatch(setNewNotification({ message: succeedResponse.data.message, timeout: -1, type: "success" }))
                }
            }
        }

        checkCookiePermission().then()

        return () => {
            active = false
        }
    }, [dispatch])

    if (cookiePermission) {
        return children
    }
}

export default CookiePermission
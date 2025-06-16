"use client"

import {axiosRequestHandler} from '@/app/(auxiliary)/func/axiosRequestHandler'
import UserService from '@/app/(auxiliary)/libs/axios/services/UserService/UserService'
import {useAppDispatch} from '@/app/(auxiliary)/libs/redux-toolkit/store/hooks'
import {setNewNotification} from '@/app/(auxiliary)/libs/redux-toolkit/store/slices/AppSlice/AppSlice'
import {ChildrenProp, CookiePermissionResponseType} from '@/app/(auxiliary)/types/AppTypes/AppTypes'
import {AxiosResponse} from 'axios'
import {FC, useEffect, useState} from 'react'

const CookiePermission: FC<ChildrenProp> = ({children}) => {
    const dispatch = useAppDispatch()
    const [cookiePermission, setCookiePermission] = useState<boolean>(false)

    useEffect(() => {
        const checkCookiePermission = async () => {
            const response = await axiosRequestHandler(() => UserService.setCookiePermission())

            if ((response as AxiosResponse).status === 200) {
                const succeedResponse = response as AxiosResponse<CookiePermissionResponseType>
                setCookiePermission(succeedResponse.data.cookiePermission)
                if (succeedResponse.data?.message) {
                    dispatch(setNewNotification({message: succeedResponse.data.message, timeout: -1, type: "success"}))
                }
            }
        }

        checkCookiePermission().then()
    }, [dispatch])

    if (cookiePermission) {
        return children
    }
}

export default CookiePermission
"use client"

import { axiosRequestsHandler } from '@/app/(auxiliary)/func/axiosRequestsHandler';
import UserService from '@/app/(auxiliary)/libs/axios/services/UserService/UserService';
import { useAppDispatch } from '@/app/(auxiliary)/libs/redux-toolkit/store/hooks';
import { setUserAuthorization } from '@/app/(auxiliary)/libs/redux-toolkit/store/slices/UserRequestsSlice/UserRequestsSlice';
import { ChildrenProp } from '@/app/(auxiliary)/types/AppTypes/AppTypes';
import { AuthorizeUserResponseType } from '@/app/(auxiliary)/types/AxiosTypes/AxiosTypes';
import { AxiosResponse } from 'axios';
import { FC, useEffect } from 'react';

const AuthorizeUser: FC<ChildrenProp> = ({ children }) => {
    const dispatch = useAppDispatch()

    useEffect(() => {
        let active = true

        const authorizeUser = async () => {
            const response = await axiosRequestsHandler(UserService.authorizeUser())

            if (active) {
                if ((response as AxiosResponse<AuthorizeUserResponseType>).status === 200) {
                    dispatch(setUserAuthorization((response as AxiosResponse<AuthorizeUserResponseType>).data.authorized))
                } else {
                    dispatch(setUserAuthorization(false))
                }
            }
        }

        authorizeUser().then()

        return () => {
            active = false
        }
    }, [])

    return (children)
}

export default AuthorizeUser
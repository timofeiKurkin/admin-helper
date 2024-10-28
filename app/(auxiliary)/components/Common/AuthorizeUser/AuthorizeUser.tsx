import React, { FC, useEffect } from 'react'
import { ChildrenType } from '@/app/(auxiliary)/types/AppTypes/AppTypes'
import { useAppDispatch } from '@/app/(auxiliary)/libs/redux-toolkit/store/hooks';
import UserService from '@/app/(auxiliary)/libs/axios/services/UserService/UserService';

const AuthorizeUser: FC<ChildrenType> = ({ children }) => {

    const dispatch = useAppDispatch()

    useEffect(() => {
        let active = true

        const authorizeUser = async () => {
            const response = await 
        }

        authorizeUser().then()

        return () => {
            active = false
        }
    }, [])

    return (children)
}

export default AuthorizeUser
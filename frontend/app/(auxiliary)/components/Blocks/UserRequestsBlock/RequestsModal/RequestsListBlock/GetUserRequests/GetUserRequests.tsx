import { axiosRequestsHandler } from '@/app/(auxiliary)/func/axiosRequestsHandler'
import HelpUserService from '@/app/(auxiliary)/libs/axios/services/HelpUserService/HelpUserService'
import { useAppDispatch } from '@/app/(auxiliary)/libs/redux-toolkit/store/hooks'
import { setUserRequests } from '@/app/(auxiliary)/libs/redux-toolkit/store/slices/UserRequestsSlice/UserRequestsSlice'
import { ChildrenProp } from '@/app/(auxiliary)/types/AppTypes/AppTypes'
import { UserRequestListType } from '@/app/(auxiliary)/types/UserRequestsTypes/UserRequestsTypes'
import { AxiosResponse } from 'axios'
import { FC, useEffect } from 'react'


const GetUserRequests: FC<ChildrenProp> = ({ children }) => {
    const dispatch = useAppDispatch()

    useEffect(() => {
        let active = true

        const getUserRequests = async () => {
            const response = await axiosRequestsHandler(HelpUserService.getUserRequests())
            if (active) {
                if ((response as AxiosResponse).status === 200) {
                    const successResponse = response as AxiosResponse<UserRequestListType>
                    dispatch(setUserRequests(successResponse.data))
                }
                // else {
                //     dispatch(setNewNotification({ message: "Не удалось получить все заявки", type: "error" }))
                // }
            }
        }

        getUserRequests().then()

        return () => {
            active = false
        }
    }, [dispatch])

    return children
}

export default GetUserRequests
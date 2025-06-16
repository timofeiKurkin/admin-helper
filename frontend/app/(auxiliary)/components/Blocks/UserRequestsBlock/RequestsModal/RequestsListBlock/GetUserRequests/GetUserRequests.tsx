import {axiosRequestHandler} from '@/app/(auxiliary)/func/axiosRequestHandler'
import HelpUserService from '@/app/(auxiliary)/libs/axios/services/HelpUserService/HelpUserService'
import {useAppDispatch} from '@/app/(auxiliary)/libs/redux-toolkit/store/hooks'
import {setUserRequests} from '@/app/(auxiliary)/libs/redux-toolkit/store/slices/UserRequestsSlice/UserRequestsSlice'
import {ChildrenProp} from '@/app/(auxiliary)/types/AppTypes/AppTypes'
import {UserRequestListType} from '@/app/(auxiliary)/types/UserRequestsTypes/UserRequestsTypes'
import {AxiosResponse} from 'axios'
import {FC, useEffect, useState} from 'react'
import Title from "@/app/(auxiliary)/components/UI/TextTemplates/Title";


const GetUserRequests: FC<ChildrenProp> = ({children}) => {
    const dispatch = useAppDispatch()
    const [isError, setIsError] = useState<boolean>(false)

    useEffect(() => {

        const getUserRequests = async () => {
            const response = await axiosRequestHandler(() => HelpUserService.getUserRequests())
            if ((response as AxiosResponse).status === 200) {
                const successResponse = response as AxiosResponse<UserRequestListType>
                dispatch(setUserRequests(successResponse.data))
            } else {
                setIsError(true)
            }
        }

        getUserRequests().then()
    }, [dispatch])

    if (isError) {
        return <Title>Не удалось получить список заявок!</Title>
    }

    return children
}

export default GetUserRequests
"use client"

import React, { FC, useEffect, useState } from 'react'
import CompleteRequestBlock from '../../../Blocks/OperatorBlocks/CompleteRequestBlock/CompleteRequestBlock'
import { HelpRequestForOperatorType } from '@/app/(auxiliary)/types/OperatorTypes/OperatorTypes'
import { axiosRequestsHandler } from '@/app/(auxiliary)/func/axiosRequestsHandler'
import OperatorService from '@/app/(auxiliary)/libs/axios/services/OperatorService/OperatorService'
import { AxiosResponse } from 'axios'
import { useAppDispatch } from '@/app/(auxiliary)/libs/redux-toolkit/store/hooks'
import LoadingCircle from '../../../UI/Loaders/LoadingCircle/LoadingCircle'
import { setNewNotification } from '@/app/(auxiliary)/libs/redux-toolkit/store/slices/AppSlice/AppSlice'
import { AnimatePresence, motion, Variants } from 'framer-motion'

interface PropsType {
    accept_url: string
}

const CompleteRequest: FC<PropsType> = ({ accept_url }) => {
    const dispatch = useAppDispatch()
    const [success, setSuccess] = useState<boolean>(false)
    const [requestPublic, setRequestPublic] = useState<HelpRequestForOperatorType>()

    useEffect(() => {
        let active = true

        const completeRequest = async (accept_url: string) => {
            const response = await axiosRequestsHandler(OperatorService.complete_request(accept_url))

            if (active) {
                if ((response as AxiosResponse).status === 200) {
                    const data = response as AxiosResponse<HelpRequestForOperatorType>
                    setRequestPublic(data.data)
                    setSuccess(true)
                } else {
                    setRequestPublic({} as HelpRequestForOperatorType)
                    dispatch(setNewNotification({
                        message: "Не удалось завершить заявку!",
                        type: "error"
                    }))
                }
            }
        }

        if (accept_url) {
            completeRequest(accept_url).then()
        }

        return () => {
            active = false
        }
    }, [dispatch, accept_url])

    const variants: Variants = {
        visible: { y: 0, opacity: 1, transition: { duration: .4 } },
        hidden: { y: 150, opacity: 0, transition: { duration: .4 } }
    }

    if (requestPublic) {
        if (success) {
            return (
                <AnimatePresence>
                    <motion.div style={{ overflow: "hidden" }} variants={variants} initial={"hidden"} animate={"visible"} exit={"hidden"}>
                        <CompleteRequestBlock request={requestPublic} />
                    </motion.div>
                </AnimatePresence>
            )
        } else {
            return <div>error block...</div>
        }
    } else {
        return <LoadingCircle />
    }
}

export default CompleteRequest
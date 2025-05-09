"use client"

import React, { FC, useEffect, useState } from 'react'
import CompleteRequestBlock from '../../../Blocks/OperatorBlocks/CompleteRequestBlock/CompleteRequestBlock'
import completeRequestData from "@/data/interface/complete-request-page/data.json"
import { CompletedHelpRequestType, HelpRequestForOperatorType } from '@/app/(auxiliary)/types/OperatorTypes/OperatorTypes'
import { axiosRequestsHandler } from '@/app/(auxiliary)/func/axiosRequestsHandler'
import OperatorService from '@/app/(auxiliary)/libs/axios/services/OperatorService/OperatorService'
import { AxiosResponse } from 'axios'
import { useAppDispatch, useAppSelector } from '@/app/(auxiliary)/libs/redux-toolkit/store/hooks'
import LoadingCircle from '../../../UI/Loaders/LoadingCircle/LoadingCircle'
import { selectCsrfToken, setCsrfToken, setNewNotification } from '@/app/(auxiliary)/libs/redux-toolkit/store/slices/AppSlice/AppSlice'
import { AnimatePresence, motion, Variants } from 'framer-motion'
import CompleteRequestError from '../../../Blocks/OperatorBlocks/CompleteRequestError/CompleteRequestError'
import styles from "./CompleteRequest.module.scss";
import { AxiosErrorType } from '@/app/(auxiliary)/types/AxiosTypes/AxiosTypes'

interface PropsType {
    accept_url: string
}

const CompleteRequest: FC<PropsType> = ({ accept_url }) => {
    const dispatch = useAppDispatch()
    const [success, setSuccess] = useState<boolean>(false)
    const csrfToken = useAppSelector(selectCsrfToken)
    const [requestPublic, setRequestPublic] = useState<HelpRequestForOperatorType>()
    const [errorData, setErrorData] = useState<{ message: string; statusCode: number }>({ message: "", statusCode: 500 })

    useEffect(() => {
        let active = true

        const completeRequest = async (accept_url: string, csrfToken: string) => {
            const response = await axiosRequestsHandler(OperatorService.complete_request(accept_url, csrfToken))

            if (active) {
                if ((response as AxiosResponse).status === 200) {
                    const successResponse = response as AxiosResponse<CompletedHelpRequestType>
                    setRequestPublic(successResponse.data.helpRequest)
                    setSuccess(true)
                    dispatch(setNewNotification({ message: completeRequestData.helpfulText, type: "success" }))
                    dispatch(setCsrfToken({ csrfToken: successResponse.data.csrfToken }))
                } else {
                    const error = response as AxiosErrorType
                    setErrorData(error)
                    setRequestPublic({} as HelpRequestForOperatorType)
                    dispatch(setNewNotification({
                        message: "Не удалось завершить заявку!",
                        type: "error"
                    }))
                }
            }
        }

        if (!requestPublic) {
            completeRequest(accept_url, csrfToken).then()
        }

        return () => {
            active = false
        }
    }, [dispatch, accept_url, csrfToken, requestPublic])

    const variants: Variants = {
        visible: { y: 0, opacity: 1, transition: { duration: .4 } },
        hidden: { y: 150, opacity: 0, transition: { duration: .4 } }
    }

    return (
        <div className={styles.completeRequestWrapper}>
            {requestPublic ? (
                <>
                    <AnimatePresence>
                        <motion.div style={{ overflow: "hidden", height: "inherit" }} variants={variants} initial={"hidden"} animate={"visible"} exit={"hidden"}>
                            {success ? (
                                <CompleteRequestBlock request={requestPublic} request_url={accept_url} />
                            ) : (
                                <CompleteRequestError code={errorData.statusCode} message={errorData.message} />
                            )}
                        </motion.div>
                    </AnimatePresence>
                </>
            ) : (
                <LoadingCircle />
            )}
        </div>
    )
}

export default CompleteRequest
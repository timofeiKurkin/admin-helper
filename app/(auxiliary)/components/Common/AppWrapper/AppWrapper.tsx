"use client"

import {FC, useContext, useEffect} from 'react';
import {AppContext} from "@/app/(auxiliary)/components/Common/Provider/Provider";
import {ChildrenType} from "@/app/(auxiliary)/types/AppTypes/AppTypes";
import {useWindowSize} from "@/app/(auxiliary)/hooks/useWindowSize";
import RootPageData from "@/data/interface/root-page/data.json";
import {RootPageType} from "@/app/(auxiliary)/types/Data/Interface/RootPage/RootPageType";
import {axiosRequestsHandler} from "@/app/(auxiliary)/func/axiosRequestsHandler";
import AppService from "@/app/(auxiliary)/libs/axios/services/AppService/AppService";
import axios, {AxiosResponse} from "axios";
import {CSRFTokenResponseType} from "@/app/(auxiliary)/types/AxiosTypes/AxiosTypes";

interface PropsType extends ChildrenType {
    CSRFToken: string;
}

const AppWrapper: FC<PropsType> = ({
                                       CSRFToken,
                                       children
                                   }) => {
    const {appState, setAppState} = useContext(AppContext)
    const {width} = useWindowSize()
    const rootPageData: RootPageType = RootPageData

    if (CSRFToken) {
        axios.defaults.headers.common['X-CSRFToken'] = CSRFToken
    }

    useEffect(() => {
        if (rootPageData.uploadFile) {
            setAppState((prevState) => ({
                ...prevState,
                rootPageContent: {
                    uploadFileContent: rootPageData.uploadFile
                }
            }))
        }
    }, [
        setAppState,
        rootPageData,
    ])

    useEffect(() => {
        let active = true

        const getCSRFToken = async () => {
            const response = await axiosRequestsHandler(AppService.getCSRFToken())

            if (active) {
                if((response as AxiosResponse<CSRFTokenResponseType>).status === 200) {
                    axios.defaults.headers.common['X-CSRFToken'] = (response as AxiosResponse<CSRFTokenResponseType>).data.csrf_token
                }
            }
        }

        if (!CSRFToken) {
            getCSRFToken().then()
        }

        return () => {
            active = false
        }
    }, [CSRFToken]);

    useEffect(() => {
        if (width) {
            if (width <= 639) {
                if (!appState.userDevice?.phoneAdaptive) {
                    setAppState({
                        ...appState,
                        userDevice: {
                            phoneAdaptive: true,
                            padAdaptive: false,
                            desktopAdaptive: false,
                            padAdaptive640_992: false
                        }
                    })
                }
            } else if (width >= 640 && width <= 1279) {
                if (width >= 640 && width <= 991) {
                    if (!appState.userDevice?.padAdaptive) {
                        setAppState({
                            ...appState,
                            userDevice: {
                                phoneAdaptive: false,
                                padAdaptive: true,
                                desktopAdaptive: false,
                                padAdaptive640_992: true
                            }
                        })
                    }
                } else {
                    if (!appState.userDevice?.padAdaptive) {
                        setAppState({
                            ...appState,
                            userDevice: {
                                phoneAdaptive: false,
                                padAdaptive: true,
                                desktopAdaptive: false,
                                padAdaptive640_992: false
                            }
                        })
                    }
                }
            } else if (width >= 1280) {
                if (!appState.userDevice?.desktopAdaptive) {
                    setAppState({
                        ...appState,
                        userDevice: {
                            phoneAdaptive: false,
                            padAdaptive: false,
                            desktopAdaptive: true,
                            padAdaptive640_992: false
                        }
                    })
                }
            }
        }
    }, [
        width,
        // appState,
        // setAppState,
        // appState.userDevice?.desktopAdaptive,
        // appState.userDevice?.padAdaptive,
        // appState.userDevice?.phoneAdaptive,
    ])

    return (children);
};

export default AppWrapper;
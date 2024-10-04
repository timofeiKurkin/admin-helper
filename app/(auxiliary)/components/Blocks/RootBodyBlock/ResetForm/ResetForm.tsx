"use client"

import React, {FC, useEffect} from 'react';
import {useAppDispatch, useAppSelector} from "@/app/(auxiliary)/libs/redux-toolkit/store/hooks";
import {
    selectServerResponse, setServerResponse
} from "@/app/(auxiliary)/libs/redux-toolkit/store/slices/UserFormDataSlice/UserFormDataSlice";

interface PropsType {
    children: React.ReactNode;
}

const ResetForm: FC<PropsType> = ({children}) => {
    
    const dispatch = useAppDispatch()
    const serverResponse = useAppSelector(selectServerResponse)

    useEffect(() => {
        if(serverResponse.sentToServer) {
            setTimeout(() => {
                dispatch(setServerResponse({
                    status: "",
                    sentToServer: false,
                    message: ""
                }))
            }, 10000)
        }
    }, [
        dispatch,
        serverResponse.sentToServer
    ]);
    
    return children
};

export default ResetForm;
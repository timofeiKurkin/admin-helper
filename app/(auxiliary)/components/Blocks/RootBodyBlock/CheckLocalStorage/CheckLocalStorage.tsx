import { useAppDispatch } from '@/app/(auxiliary)/libs/redux-toolkit/store/hooks'
import { changeCompanyInputDataType } from '@/app/(auxiliary)/libs/redux-toolkit/store/slices/UserFormDataSlice/UserFormDataSlice'
import { ChildrenProp } from '@/app/(auxiliary)/types/AppTypes/AppTypes'
import { CompanyInputDataType, companyLocalData, companyLocalDataVariable } from '@/app/(auxiliary)/types/AppTypes/InputHooksTypes'
import { FC, useLayoutEffect } from 'react'

const CheckLocalStorage: FC<ChildrenProp> = ({ children }) => {
    const dispatch = useAppDispatch()

    useLayoutEffect(() => {
        const localData = localStorage.getItem(companyLocalDataVariable) as "0" | "1" | null

        if (localData) {
            const companyInputDataType: CompanyInputDataType = companyLocalData[localData]
            dispatch(changeCompanyInputDataType(companyInputDataType))
        }
    }, [dispatch])

    return children
}

export default CheckLocalStorage
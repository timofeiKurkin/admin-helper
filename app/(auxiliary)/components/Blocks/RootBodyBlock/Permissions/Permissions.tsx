"use client"

import Checkbox from "@/app/(auxiliary)/components/UI/SVG/Checkbox/Checkbox";
import TextHighlighting from "@/app/(auxiliary)/components/UI/TextHighlighting/TextHighlighting";
import SmallText from "@/app/(auxiliary)/components/UI/TextTemplates/SmallText";
import { useAppDispatch, useAppSelector } from "@/app/(auxiliary)/libs/redux-toolkit/store/hooks";
import { setNewNotification } from '@/app/(auxiliary)/libs/redux-toolkit/store/slices/AppSlice/AppSlice';
import {
    deleteRejectionInput,
    selectPermissionsOfForm,
    selectRejectionInputs,
    setAgreePolitics,
    setUserCanTalk
} from "@/app/(auxiliary)/libs/redux-toolkit/store/slices/UserFormDataSlice/UserFormDataSlice";
import { PermissionsContentType } from "@/app/(auxiliary)/types/Data/Interface/RootPage/RootPageContentType";
import { FC, useEffect, useState } from 'react';
import styles from "./Permissions.module.scss";


interface PropsType {
    permissionsContent: PermissionsContentType;
}

const Permissions: FC<PropsType> = ({
    permissionsContent
}) => {
    const dispatch = useAppDispatch()
    const permissionsOfForm = useAppSelector(selectPermissionsOfForm)
    const rejectionInputs = useAppSelector(selectRejectionInputs)
    const [isError, setIsError] = useState<boolean>(false)

    const canTalkHandle = () => {
        dispatch(setUserCanTalk())
    }

    const agreePermissionHandler = () => {
        if (isError && rejectionInputs.includes("user_political")) {
            dispatch(deleteRejectionInput("user_political"))
            setIsError(false)
        }

        dispatch(setAgreePolitics())
    }

    useEffect(() => {
        if (!isError && rejectionInputs.length && rejectionInputs.includes("user_political")) {
            setIsError(true)
            dispatch(setNewNotification({
                message: "Разрешите обработку персональных данных",
                type: "error"
            }))
        }
    }, [rejectionInputs, dispatch, isError])

    return (
        <div className={styles.permissionsWrapper}>
            <div className={styles.permissionBlock}
                onClick={canTalkHandle}>
                <Checkbox toggleStatus={permissionsOfForm.userCanTalk} className={styles.permissionCheckbox} />
                <SmallText>{permissionsContent.ICanAnswer}</SmallText>
            </div>

            <div className={styles.permissionBlock}
                onClick={agreePermissionHandler}>
                <Checkbox toggleStatus={permissionsOfForm.userAgreedPolitical}
                    isError={isError}
                    className={styles.permissionCheckbox} />
                <TextHighlighting wordIndexes={[3, 6]}
                    link={permissionsContent.preparationLinkToPolicy}
                    style={{ fontWeight: 500 }}>
                    <SmallText>{permissionsContent.personalDataPreparation}</SmallText>
                </TextHighlighting>
            </div>
        </div>
    );
};

export default Permissions;
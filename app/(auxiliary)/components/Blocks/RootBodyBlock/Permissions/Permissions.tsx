"use client"

import React, { FC, useEffect, useState } from 'react';
import SmallText from "@/app/(auxiliary)/components/UI/TextTemplates/SmallText";
import { PermissionsContentType } from "@/app/(auxiliary)/types/Data/Interface/RootPage/RootPageContentType";
import Checkbox from "@/app/(auxiliary)/components/UI/SVG/Checkbox/Checkbox";
import TextHighlighting from "@/app/(auxiliary)/components/UI/TextHighlighting/TextHighlighting";
import styles from "./Permissions.module.scss"
import { useAppDispatch, useAppSelector } from "@/app/(auxiliary)/libs/redux-toolkit/store/hooks";
import {
    deleteRejectionInput,
    selectPermissionsOfForm,
    selectRejectionInputs,
    setAgreePolitics,
    setUserCanTalk
} from "@/app/(auxiliary)/libs/redux-toolkit/store/slices/UserFormDataSlice/UserFormDataSlice";


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
        if (rejectionInputs.length && rejectionInputs.includes("user_political")) {
            setIsError(true)
        }
    }, [rejectionInputs])

    return (
        <div className={styles.permissionsWrapper}>
            <div className={styles.permissionBlock}
                onClick={canTalkHandle}>
                <Checkbox toggleStatus={permissionsOfForm.userCanTalk} />
                <SmallText>{permissionsContent.ICanAnswer}</SmallText>
            </div>

            <div className={styles.permissionBlock}
                onClick={agreePermissionHandler}>
                <Checkbox toggleStatus={permissionsOfForm.userAgreedPolitical} isError={isError} />
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
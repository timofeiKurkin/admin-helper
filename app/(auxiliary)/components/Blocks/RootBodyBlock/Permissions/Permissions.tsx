"use client"

import React, {FC, useContext} from 'react';
import SmallText from "@/app/(auxiliary)/components/UI/TextTemplates/SmallText";
import {PermissionsContentType} from "@/app/(auxiliary)/types/Data/Interface/RootPage/RootPageContentType";
import Checkbox from "@/app/(auxiliary)/components/UI/SVG/Checkbox/Checkbox";
import TextHighlighting from "@/app/(auxiliary)/components/UI/TextHighlighting/TextHighlighting";
import styles from "./Permissions.module.scss"
import {AppContext} from "@/app/(auxiliary)/components/Common/Provider/Provider";
import {useAppDispatch, useAppSelector} from "@/app/(auxiliary)/libs/redux-toolkit/store/hooks";
import {
    selectPermissionsOfForm, setPermissionPolitic, setUserCanTalk
} from "@/app/(auxiliary)/libs/redux-toolkit/store/slices/UserFormDataSlice/UserFormDataSlice";


interface PropsType {
    permissionsContent: PermissionsContentType;
}

const Permissions: FC<PropsType> = ({
                                        permissionsContent
                                    }) => {
    const dispatch = useAppDispatch()
    const permissionsOfForm = useAppSelector(selectPermissionsOfForm)

    const canTalkHandle = () => {
        dispatch(setPermissionPolitic())
    }

    const agreePermissionHandler = () => {
        dispatch(setUserCanTalk())
    }

    return (
        <div className={styles.permissionsWrapper}>
            <div className={styles.permissionBlock}
                 onClick={canTalkHandle}>
                <Checkbox toggleStatus={permissionsOfForm.userCanTalk}/>
                <SmallText>{permissionsContent.ICanAnswer}</SmallText>
            </div>

            <div className={styles.permissionBlock}
                 onClick={agreePermissionHandler}>
                <Checkbox toggleStatus={permissionsOfForm.userAgreed}/>
                <TextHighlighting wordIndexes={[3, 6]}
                                  link={permissionsContent.preparationLinkToPolicy}
                                  style={{fontWeight: 500}}>
                    <SmallText>{permissionsContent.personalDataPreparation}</SmallText>
                </TextHighlighting>
            </div>
        </div>
    );
};

export default Permissions;
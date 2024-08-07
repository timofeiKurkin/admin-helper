"use client"

import React, {FC, useContext} from 'react';
import SmallText from "@/app/(auxiliary)/components/UI/TextTemplates/SmallText";
import {PermissionsContentType} from "@/app/(auxiliary)/types/Data/Interface/RootPage/RootPageType";
import Checkbox from "@/app/(auxiliary)/components/UI/SVG/Checkbox/Checkbox";
import TextHighlighting from "@/app/(auxiliary)/components/UI/TextHighlighting/TextHighlighting";
import styles from "./Permissions.module.scss"
import {AppContext} from "@/app/(auxiliary)/components/Common/Provider/Provider";


interface PropsType {
    permissionsContent: PermissionsContentType;
}

const Permissions: FC<PropsType> = ({
                                        permissionsContent
                                    }) => {
    const {appState, setAppState} = useContext(AppContext)

    const canTalkHandle = () => {
        setAppState({
            ...appState,
            permissionAgree: {
                ...appState.permissionAgree,
                userCanTalk: !appState.permissionAgree?.userCanTalk
            }
        })
    }

    const agreePermissionHandler = () => {
        setAppState({
            ...appState,
            permissionAgree: {
                ...appState.permissionAgree,
                userAgreed: !appState.permissionAgree?.userAgreed
            }
        })
    }

    return (
        <div className={styles.permissionsWrapper}>
            <div className={styles.permissionBlock}
                 onClick={canTalkHandle}>
                <Checkbox toggleStatus={!!appState.permissionAgree?.userCanTalk}/>
                <SmallText>{permissionsContent.ICanAnswer}</SmallText>
            </div>

            <div className={styles.permissionBlock}
                 onClick={agreePermissionHandler}>
                <Checkbox toggleStatus={!!appState.permissionAgree?.userAgreed}/>
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
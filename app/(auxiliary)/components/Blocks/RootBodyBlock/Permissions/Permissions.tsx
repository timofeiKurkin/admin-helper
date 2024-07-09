"use client"

import React, {FC, useState} from 'react';
import SmallText from "@/app/(auxiliary)/components/UI/TextTemplates/SmallText";
import {PermissionsContent} from "@/app/(auxiliary)/types/Data/Interface/RootPage/RootPageType";
import Checkbox from "@/app/(auxiliary)/components/UI/SVG/Checkbox/Checkbox";
import TextHighlighting from "@/app/(auxiliary)/components/UI/TextHighlighting/TextHighlighting";
import styles from "./Permissions.module.scss"


interface PropsType {
    permissionsContent: PermissionsContent;
}

const Permissions: FC<PropsType> = ({permissionsContent}) => {
    const [userCanAnswer, setUserCanAnswer] =
        useState<boolean>(false);
    const [agreePermissions, setAgreePermissions] =
        useState<boolean>(false);

    return (
        <div className={styles.permissionsWrapper}>
            <div className={styles.permissionBlock}
                 onClick={() => setUserCanAnswer((prevState) => !prevState)}>
                <Checkbox toggleStatus={userCanAnswer}/>
                <SmallText>{permissionsContent.ICanAnswer}</SmallText>
            </div>

            <div className={styles.permissionBlock}
                 onClick={() => setAgreePermissions((prevState) => !prevState)}>
                <Checkbox toggleStatus={agreePermissions}/>
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
import React, { FC, useEffect, useState } from 'react';
import styles from "./AllowToUseMicrophone.module.scss"
import PopupDisableScroll from "@/app/(auxiliary)/components/Common/Popups/PopupsWrapper/PopupDisableScroll/PopupDisableScroll";
import Title from "@/app/(auxiliary)/components/UI/TextTemplates/Title";

interface PropsType {
    isRecording: boolean;
    microphonePermission: PermissionState | undefined;
    stopRecording: () => void
}

/**
 * Компонент с подсказками для использования микрофона пользователя
 * @param isRecording
 * @param microphonePermission
 * @param stopRecording
 * @constructor
 */
const AllowToUseMicrophone: FC<PropsType> = ({
    isRecording,
    microphonePermission,
    stopRecording
}) => {

    useEffect(() => {
        // setTimeout(() => {
        //     stopRecording()
        // }, 15000)
    }, [stopRecording]);

    return (
        <PopupDisableScroll>
            <div className={styles.allowWrapper}>
                <div className={styles.allowBody}>
                    <Title>Сперва нужно разрешить приложению использовать микрофон вашего устройства.
                        Нажмите разрешить в появившемся уведомлении браузера</Title>
                </div>
            </div>
        </PopupDisableScroll>
    );
};

export default AllowToUseMicrophone;
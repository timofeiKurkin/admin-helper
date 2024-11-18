import React, { FC, useState } from 'react';
import styles from "./HaveMediaFile.module.scss"
import { PHOTO_KEY, PhotoAndVideoKeysType, VIDEO_KEY } from "@/app/(auxiliary)/types/AppTypes/InputHooksTypes";
import Button from "@/app/(auxiliary)/components/UI/Button/Button";
import PhotoEditorPopup from "@/app/(auxiliary)/components/Blocks/Popups/PhotoEditorPopup/PhotoEditorPopup";
import VideoPlayerPopup from "@/app/(auxiliary)/components/Blocks/Popups/VideoPlayerPopup/VideoPlayerPopup";
import { useAppSelector } from "@/app/(auxiliary)/libs/redux-toolkit/store/hooks";
import { selectPopups } from "@/app/(auxiliary)/libs/redux-toolkit/store/slices/PopupSlice/PopupSlice";
import DropZone from "@/app/(auxiliary)/components/Blocks/FormBlock/DropZone/DropZone";
import FileList
    from "@/app/(auxiliary)/components/Blocks/FormBlock/CoupleOfInputs/CurrentInput/FileInput/FilesList/FileList";
import { selectUserDevice } from '@/app/(auxiliary)/libs/redux-toolkit/store/slices/AppSlice/AppSlice';
import ModalWrapper from '@/app/(auxiliary)/components/UI/Wrappers/ModalWrapper/ModalWrapper';
import OpacityAnimation from '@/app/(auxiliary)/components/UI/Animations/OpacityAnimation/OpacityAnimation';

interface PropsType {
    inputData: {
        type: PhotoAndVideoKeysType;
        placeholder: string;
        button: string;
    }
}

const HaveMediaFile: FC<PropsType> = ({ inputData }) => {
    const { phoneAdaptive } = useAppSelector(selectUserDevice)
    const popupVisibility = useAppSelector(selectPopups)[inputData.type]
    const [dragDropZoneIsOpen, setDragDropZoneIsOpen] =
        useState<boolean>()

    const openDragDropZone = () => {
        setDragDropZoneIsOpen((prevState) => (!prevState));
    }

    return (
        <>
            <div className={styles.filesBlock}>
                <div className={styles.fileList}>
                    <FileList placeholder={inputData.placeholder}
                        type={inputData.type as PhotoAndVideoKeysType} />
                </div>
                <div className={styles.addFiles}>
                    <Button onClick={openDragDropZone}>{inputData.button}</Button>
                </div>
            </div>

            {phoneAdaptive ? (
                dragDropZoneIsOpen !== undefined ? (
                    <DropZone inputType={inputData.type as PhotoAndVideoKeysType}
                        openDragDropZone={openDragDropZone}
                        dragDropZoneIsOpen={dragDropZoneIsOpen} />
                ) : null
            ) : (
                dragDropZoneIsOpen ? (
                    <DropZone inputType={inputData.type as PhotoAndVideoKeysType}
                        openDragDropZone={openDragDropZone}
                        dragDropZoneIsOpen={dragDropZoneIsOpen} />
                ) : null
            )}

            <ModalWrapper>
                <OpacityAnimation trigger={popupVisibility && inputData.type === PHOTO_KEY}>
                    <PhotoEditorPopup />
                </OpacityAnimation>
            </ModalWrapper>

            {/* {popupVisibility && inputData.type === PHOTO_KEY && (
                <PhotoEditorPopup />
            )} */}

            {popupVisibility && inputData.type === VIDEO_KEY && (
                <VideoPlayerPopup />
            )}
        </>
    );
};

export default HaveMediaFile;
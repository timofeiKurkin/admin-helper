import React, {FC, useState} from 'react';
import styles from "./HaveMediaFile.module.scss"
import {PHOTO_KEY, PhotoAndVideoKeysTypes, VIDEO_KEY} from "@/app/(auxiliary)/types/AppTypes/InputHooksTypes";
import Button from "@/app/(auxiliary)/components/UI/Button/Button";
import PhotoEditorPopup from "@/app/(auxiliary)/components/Blocks/Popups/PhotoEditorPopup/PhotoEditorPopup";
import VideoPlayerPopup from "@/app/(auxiliary)/components/Blocks/Popups/VideoPlayerPopup/VideoPlayerPopup";
import {useAppSelector} from "@/app/(auxiliary)/libs/redux-toolkit/store/hooks";
import {selectRootPageContent} from "@/app/(auxiliary)/libs/redux-toolkit/store/slices/AppSlice/AppSlice";
import {selectPopups} from "@/app/(auxiliary)/libs/redux-toolkit/store/slices/PopupSlice/PopupSlice";
import DropZone from "@/app/(auxiliary)/components/Blocks/FormBlock/DropZone/DropZone";
import FileList
    from "@/app/(auxiliary)/components/Blocks/FormBlock/CoupleOfInputs/CurrentInput/FileInput/FilesList/FileList";

interface PropsType {
    inputData: {
        type: PhotoAndVideoKeysTypes;
        placeholder: string;
        button: string;
    }
}

const HaveMediaFile: FC<PropsType> = ({inputData}) => {
    const rootPageContent = useAppSelector(selectRootPageContent)
    const popupVisibility = useAppSelector(selectPopups)[inputData.type]

    const [dragDropZoneIsOpen, setDragDropZoneIsOpen] =
        useState<boolean>(false)

    const openDragDropZone = () => {
        setDragDropZoneIsOpen((prevState) => !prevState);
    }

    return (
        <>
            <div className={styles.filesBlock}>
                <div className={styles.fileList}>
                    <FileList placeholder={inputData.placeholder}
                              type={inputData.type as PhotoAndVideoKeysTypes}/>
                </div>
                {(inputData.type !== VIDEO_KEY) ? (
                    <div className={styles.addFiles}>
                        <Button onClick={openDragDropZone}>{inputData.button}</Button>
                    </div>
                ) : null}
            </div>

            {(dragDropZoneIsOpen && rootPageContent) ? (
                <DropZone content={rootPageContent.contentOfUploadBlock}
                          inputType={inputData.type as PhotoAndVideoKeysTypes}
                          visibleDragDropZone={openDragDropZone}
                />
            ) : null}

            {popupVisibility && inputData.type === PHOTO_KEY && (
                <PhotoEditorPopup/>
            )}

            {popupVisibility && inputData.type === VIDEO_KEY && (
                <VideoPlayerPopup/>
            )}
        </>
    );
};

export default HaveMediaFile;
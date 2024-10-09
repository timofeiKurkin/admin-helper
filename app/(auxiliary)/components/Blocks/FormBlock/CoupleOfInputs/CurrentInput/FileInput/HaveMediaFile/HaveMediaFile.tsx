import React, {FC, useRef, useState} from 'react';
import styles from "./HaveMediaFile.module.scss"
import {PHOTO_KEY, PhotoAndVideoKeysTypes, VIDEO_KEY} from "@/app/(auxiliary)/types/AppTypes/InputHooksTypes";
import Button from "@/app/(auxiliary)/components/UI/Button/Button";
import PhotoEditorPopup from "@/app/(auxiliary)/components/Blocks/Popups/PhotoEditorPopup/PhotoEditorPopup";
import VideoPlayerPopup from "@/app/(auxiliary)/components/Blocks/Popups/VideoPlayerPopup/VideoPlayerPopup";
import {useAppSelector} from "@/app/(auxiliary)/libs/redux-toolkit/store/hooks";
import {
    selectRootPageContent,
    selectUserDevice
} from "@/app/(auxiliary)/libs/redux-toolkit/store/slices/AppSlice/AppSlice";
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
    const popupVisibility = useAppSelector(selectPopups)[inputData.type]
    const userDevice = useAppSelector(selectUserDevice)

    const inputRef = useRef<HTMLInputElement>(null)
    const [dragDropZoneIsOpen, setDragDropZoneIsOpen] =
        useState<boolean>(false)

    const openDragDropZone = () => {
        setDragDropZoneIsOpen((prevState) => !prevState);
        // if (!userDevice.phoneAdaptive) {
        //     setDragDropZoneIsOpen((prevState) => !prevState);
        // } else {
        //     if(inputRef.current) {
        //         inputRef.current.click()
        //     }
        // }
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

            <DropZone inputType={inputData.type as PhotoAndVideoKeysTypes}
                      visibleDragDropZone={openDragDropZone}
                      dragDropZoneIsOpen={dragDropZoneIsOpen}/>

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
import React, {FC, useState} from 'react';
import {PhotoAndVideoInputType} from "@/app/(auxiliary)/types/Data/Interface/RootPage/RootPageContentType";
import styles from "./FileInput.module.scss";
import Toggle from "@/app/(auxiliary)/components/Common/Switches/Toggle/Toggle";
import FilesList
    from "@/app/(auxiliary)/components/Blocks/FormBlock/CoupleOfInputs/CurrentInput/FileInput/FilesList/FilesList";
import Button from "@/app/(auxiliary)/components/UI/Button/Button";
import DropZone from "@/app/(auxiliary)/components/Blocks/FormBlock/DropZone/DropZone";
import PhotoEditor from "@/app/(auxiliary)/components/Blocks/Popups/PhotoEditorPopup/PhotoEditorPopup";
import {PHOTO_KEY, PhotoAndVideoKeysTypes, VIDEO_KEY} from "@/app/(auxiliary)/types/AppTypes/InputHooksTypes";
import {useAppDispatch, useAppSelector} from "@/app/(auxiliary)/libs/redux-toolkit/store/hooks";
import {
    selectRootPageContent,
    selectUserDevice,
    setOpenedPhotoBlock,
    setOpenedVideoBlock,
    setSwitchedMessageBlock
} from "@/app/(auxiliary)/libs/redux-toolkit/store/slices/AppSlice/AppSlice";
import {
    changeEditorVisibility,
    selectEditorIsOpen,
    setCurrentOpenedFileName
} from "@/app/(auxiliary)/libs/redux-toolkit/store/slices/PhotoEditorSlice/PhotoEditorSlice";
import VideoPlayerPopup from "@/app/(auxiliary)/components/Blocks/Popups/VideoPlayerPopup/VideoPlayerPopup";


interface PropsType {
    input: PhotoAndVideoInputType;
}

const FileInput: FC<PropsType> = ({input}) => {
    const dispatch = useAppDispatch()
    const userDevice = useAppSelector(selectUserDevice)
    const rootPageContent = useAppSelector(selectRootPageContent)
    const editorIsOpen = useAppSelector(selectEditorIsOpen)

    const [haveMediaFile, setHaveMediaFile] =
        useState<boolean>(false)
    const [dragDropZoneIsOpen, setDragDropZoneIsOpen] =
        useState<boolean>(false)

    const openDragDropZone = () => {
        setDragDropZoneIsOpen((prevState) => !prevState);

        if (!dragDropZoneIsOpen) {
            document.body.style.overflow = "hidden"
        } else {
            document.body.style.overflow = "auto"
        }
    }

    const openSelectedFile = (fileName: string) => {
        dispatch(setCurrentOpenedFileName({fileName}))
        dispatch(changeEditorVisibility())
    }

    const fileBlockHandler = () => {
        setHaveMediaFile((prevState) => !prevState)

        if (userDevice.padAdaptive640_992) {
            dispatch(setSwitchedMessageBlock(!haveMediaFile))
        } else {
            if (input.type === PHOTO_KEY) {
                dispatch(setOpenedPhotoBlock(!haveMediaFile))
            }

            if (input.type === VIDEO_KEY) {
                dispatch(setOpenedVideoBlock(!haveMediaFile))
            }
        }
    }

    return (
        <div className={styles.fileInputWrapper}>
            <Toggle toggleStatus={haveMediaFile}
                    onClick={fileBlockHandler}>
                {input.toggleText}
            </Toggle>

            {haveMediaFile && (
                <>
                    <div className={styles.filesBlock}>
                        <div className={styles.fileList}>
                            <FilesList placeholder={input.inputPlaceholder || ""}
                                       type={input.type as PhotoAndVideoKeysTypes}
                                       changeFile={openSelectedFile}/>
                        </div>

                        <div className={styles.addFiles}>
                            <Button onClick={openDragDropZone}>{input.button}</Button>
                        </div>
                    </div>

                    {(dragDropZoneIsOpen && rootPageContent) ? (
                        <DropZone content={rootPageContent.contentOfUploadBlock}
                                  inputType={input.type as PhotoAndVideoKeysTypes}
                                  visibleDragDropZone={openDragDropZone}
                        />
                    ) : null}

                    {editorIsOpen && input.type === "photo" && (
                        <PhotoEditor/>
                    )}

                    {editorIsOpen && input.type === "video" && (
                        <VideoPlayerPopup/>
                    )}
                </>

            )}
        </div>
    );
};

export default FileInput;
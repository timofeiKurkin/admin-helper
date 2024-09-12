import React, {FC, useState} from 'react';
import {PhotoAndVideoInputType} from "@/app/(auxiliary)/types/Data/Interface/RootPage/RootPageContentType";
import styles from "./FileInput.module.scss";
import Toggle from "@/app/(auxiliary)/components/Common/Switches/Toggle/Toggle";
import FilesList
    from "@/app/(auxiliary)/components/Blocks/FormBlock/CoupleOfInputs/CurrentInput/FileInput/FilesList/FilesList";
import Button from "@/app/(auxiliary)/components/UI/Button/Button";
import DropZone from "@/app/(auxiliary)/components/Blocks/FormBlock/DropZone/DropZone";
import PhotoEditor from "@/app/(auxiliary)/components/Blocks/PhotoEditor/PhotoEditor";
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
    setCurrentOpenedFileName
} from "@/app/(auxiliary)/libs/redux-toolkit/store/slices/PhotoEditorSlice/PhotoEditorSlice";


interface PropsType {
    currentInput: PhotoAndVideoInputType;
}

const FileInput: FC<PropsType> = ({currentInput}) => {
    const dispatch = useAppDispatch()
    const userDevice = useAppSelector(selectUserDevice)
    const rootPageContent = useAppSelector(selectRootPageContent)

    const [haveMediaFile, setHaveMediaFile] =
        useState<boolean>(false)
    const [dragDropZoneIsOpen, setDragDropZoneIsOpen] =
        useState<boolean>(false)
    const [photoEditorIsOpen, setPhotoEditorIsOpen] =
        useState<boolean>(false)

    const openDragDropZone = () => {
        setDragDropZoneIsOpen((prevState) => !prevState);

        if (!dragDropZoneIsOpen) {
            document.body.style.overflow = "hidden"
        } else {
            document.body.style.overflow = "auto"
        }
    }

    const openPhotoEditor = () => {
        setDragDropZoneIsOpen((prevState) => (prevState ? !prevState : prevState))
        setPhotoEditorIsOpen((prevState) => (!prevState))
    }

    const openSelectedFile = (fileName: string) => {
        setPhotoEditorIsOpen((prevState) => (!prevState))
        dispatch(setCurrentOpenedFileName({fileName}))
    }

    const fileBlockHandler = () => {
        setHaveMediaFile((prevState) => !prevState)

        if (userDevice.padAdaptive640_992) {
            dispatch(setSwitchedMessageBlock(!haveMediaFile))
        } else {
            if (currentInput.type === PHOTO_KEY) {
                dispatch(setOpenedPhotoBlock(!haveMediaFile))
            }

            if (currentInput.type === VIDEO_KEY) {
                dispatch(setOpenedVideoBlock(!haveMediaFile))
            }
        }
    }

    return (
        <div className={styles.fileInputWrapper}>
            <Toggle toggleStatus={haveMediaFile}
                    onClick={fileBlockHandler}>
                {currentInput.toggleText}
            </Toggle>

            {haveMediaFile && (
                <div className={styles.filesBlock}>
                    <div className={styles.fileList}>
                        <FilesList placeholder={currentInput.inputPlaceholder || ""}
                                   type={currentInput.type as any}
                                   changeFile={openSelectedFile}/>
                    </div>

                    <div className={styles.addFiles}>
                        <Button onClick={openDragDropZone}>{currentInput.button}</Button>
                    </div>
                </div>
            )}

            {(dragDropZoneIsOpen && rootPageContent) ? (
                <DropZone content={rootPageContent.contentOfUploadBlock}
                          inputType={currentInput.type as any}
                          visibleDragDropZone={openDragDropZone}
                          openPhotoEditor={openPhotoEditor}
                />
            ) : null}
            {/*{haveMediaFile && (<DragDrop currentContent={currentInput}/>)}*/}

            {photoEditorIsOpen &&
                <PhotoEditor visiblePhotoEditor={openPhotoEditor}
                             dataForEditor={{
                                 inputType: currentInput.type as PhotoAndVideoKeysTypes,
                             }}/>}
        </div>
    );
};

export default FileInput;
// "use client"

import React, {FC, useContext, useState} from 'react';
import {PhotoAndVideoInputType} from "@/app/(auxiliary)/types/Data/Interface/RootPage/RootPageType";
import styles from "./FileInput.module.scss";
import Toggle from "@/app/(auxiliary)/components/Common/Switches/Toggle/Toggle";
import FilesList
    from "@/app/(auxiliary)/components/Blocks/FormBlock/CoupleOfInputs/CurrentInput/FileInput/FilesList/FilesList";
import Button from "@/app/(auxiliary)/components/UI/Button/Button";
import DropZone from "@/app/(auxiliary)/components/Blocks/FormBlock/DropZone/DropZone";
import {AppContext} from "@/app/(auxiliary)/components/Common/Provider/Provider";


interface PropsType {
    currentInput: PhotoAndVideoInputType;
}

const FileInput: FC<PropsType> = ({currentInput}) => {
    const [haveMediaFile, setHaveMediaFile] =
        useState<boolean>(false);
    const [dragDropZoneIsOpen, setDragDropZoneIsOpen] = useState<boolean>(false);
    const {appState, setAppState} = useContext(AppContext)

    const openDragDropZone = () => {
        setDragDropZoneIsOpen((prevState) => !prevState);

        if(!dragDropZoneIsOpen) {
            document.body.style.overflow = "hidden"
        } else {
            document.body.style.overflow = "auto"
        }
    }

    const fileBlockHandler = () => {
        setHaveMediaFile((prevState) => !prevState)

        if(appState.userDevice?.desktopAdaptive) {
            if(currentInput.type === 'photo') {
                setAppState({
                    ...appState,
                    openedPhotoBlock: !haveMediaFile
                })
            }

            if(currentInput.type === "video") {
                setAppState({
                    ...appState,
                    openedVideoBlock: !haveMediaFile
                })
            }
        } else {
            setAppState({
                ...appState,
                switchedMessageBlock: !haveMediaFile
            })
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
                                   type={currentInput.type}/>
                    </div>

                    <div className={styles.addFiles}>
                        <Button onClick={openDragDropZone}>{currentInput.button}</Button>
                    </div>
                </div>
            )}

            {(dragDropZoneIsOpen && appState.rootPageContent) ? (
                <DropZone content={appState.rootPageContent.uploadFileContent}
                          filesType={currentInput.type}
                          visibleDragDropZone={openDragDropZone}
                />
            ) : null}
            {/*{haveMediaFile && (<DragDrop currentContent={currentInput}/>)}*/}
        </div>
    );
};

export default FileInput;
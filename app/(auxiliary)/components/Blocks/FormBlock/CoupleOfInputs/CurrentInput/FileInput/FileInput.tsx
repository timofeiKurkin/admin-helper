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
    const {appState} = useContext(AppContext)

    const openDragDropZone = () => {
        setDragDropZoneIsOpen((prevState) => !prevState);
    }

    return (
        <div className={styles.fileInputWrapper}>
            <Toggle toggleStatus={haveMediaFile}
                    onClick={() => setHaveMediaFile((prevState) => !prevState)}>
                {currentInput.toggleText}
            </Toggle>

            {haveMediaFile && (
                <div className={styles.filesBlock}>
                    <div className={styles.fileList}>
                        <FilesList placeholder={currentInput.inputPlaceholder || ""}/>
                    </div>

                    <div className={styles.addFiles}>
                        <Button onClick={openDragDropZone}>{currentInput.button}</Button>
                    </div>
                </div>
            )}

            {(dragDropZoneIsOpen && appState.rootPageContent) ? (
                <DropZone content={appState.rootPageContent.uploadFileContent}
                          filesType={currentInput.type}
                          openDragDropZone={openDragDropZone}
                />
            ) : null}
            {/*{haveMediaFile && (<DragDrop currentContent={currentInput}/>)}*/}
        </div>
    );
};

export default FileInput;
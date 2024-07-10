import React, {FC, useState} from 'react';
import {PhotoAndVideoInputType} from "@/app/(auxiliary)/types/Data/Interface/RootPage/RootPageType";
import DragDrop from "@/app/(auxiliary)/components/Blocks/FormBlock/DragDrop/DragDrop";
import styles from "./FileInput.module.scss";
import Toggle from "@/app/(auxiliary)/components/Common/Switches/Toggle/Toggle";


interface PropsType {
    currentInput: PhotoAndVideoInputType;
}

const FileInput: FC<PropsType> = ({currentInput}) => {
    const [haveMediaFile, setHaveMediaFile] =
        useState<boolean>(false);

    return (
        <div className={styles.fileInputWrapper}>
            <Toggle toggleStatus={haveMediaFile} onClick={() => setHaveMediaFile((prevState) => !prevState)}>
                {currentInput.toggleText}
            </Toggle>

            {haveMediaFile && (<DragDrop currentContent={currentInput}/>)}
        </div>
    );
};

export default FileInput;
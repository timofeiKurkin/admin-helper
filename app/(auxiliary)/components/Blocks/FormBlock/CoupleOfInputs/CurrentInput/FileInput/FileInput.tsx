import React, {FC, useState} from 'react';
import {PhotoAndVideoInputType} from "@/app/(auxiliary)/types/Data/Interface/RootPage/RootPageType";
import DragDrop from "@/app/(auxiliary)/components/Blocks/FormBlock/DragDrop/DragDrop";
import SmallText from "@/app/(auxiliary)/components/UI/TextTemplates/SmallText";
import ToggleSVG from "@/app/(auxiliary)/components/UI/SVG/Toggle/ToggleSVG";
import styles from "./FileInput.module.scss";


interface PropsType {
    currentInput: PhotoAndVideoInputType;
}

const FileInput: FC<PropsType> = ({currentInput}) => {
    const [haveMediaFile, setHaveMediaFile] = useState<boolean>(false);

    return (
        <div className={styles.fileInputWrapper}>
            <div className={styles.fileInputToggle}
                 onClick={() => setHaveMediaFile((prevState) => !prevState)}>
                <ToggleSVG toggleStatus={haveMediaFile}/>

                <SmallText>{currentInput.toggleText}</SmallText>
            </div>

            {haveMediaFile && (<DragDrop currentContent={currentInput}/>)}
        </div>
    );
};

export default FileInput;
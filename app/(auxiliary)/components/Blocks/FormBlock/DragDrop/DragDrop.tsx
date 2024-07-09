import React, {FC} from 'react';
import DropZone from "@/app/(auxiliary)/components/Blocks/FormBlock/DragDrop/DropZone/DropZone";
import {PhotoAndVideoInputType} from "@/app/(auxiliary)/types/Data/Interface/RootPage/RootPageType";
import styles from "./DragDrop.module.scss";

interface PropsType {
    currentContent: PhotoAndVideoInputType;
}

const DragDrop: FC<PropsType> = ({currentContent}) => {


    return (
        <div className={styles.dragDropWrapper}>
            <DropZone dropZonePlaceholder={currentContent.inputPlaceholder}
                      dropZoneType={currentContent.type}/>

            <div>{currentContent.button}</div>
        </div>
    );
};

export default DragDrop;
import React, {FC} from 'react';
import DropZone from "@/app/(auxiliary)/components/Blocks/FormBlock/DragDrop/DropZone/DropZone";
import {PhotoAndVideoInputType} from "@/app/(auxiliary)/types/Data/Interface/RootPage/RootPageType";
import styles from "./DragDrop.module.scss";
import Button from "@/app/(auxiliary)/components/UI/Button/Button";

interface PropsType {
    currentContent: PhotoAndVideoInputType;
}

const DragDrop: FC<PropsType> = ({currentContent}) => {


    return (
        <div className={styles.dragDropWrapper}>
            <div className={styles.dropZone}>
                <DropZone dropZonePlaceholder={currentContent.inputPlaceholder}
                          dropZoneType={currentContent.type}/>
            </div>

            <div className={styles.add}>
                <Button>
                    {currentContent.button}
                </Button>
            </div>
        </div>
    );
};

export default DragDrop;